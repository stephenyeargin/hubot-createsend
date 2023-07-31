// Description:
//   Manage your Campaign Monitor account via Hubot
//
// Configuration:
//   CREATESEND_API_KEY
//   CREATESEND_CLIENT_ID
//   CREATESEND_LIST_ID
//
// Commands:
//   hubot createsend subscribe <email> - Add email to list
//   hubot createsend unsubscribe <email> - Remove email from list
//   hubot createsend - Get statistics from latest mailing
//
// Author:
//   stephenyeargin

const { CreateSend } = require('@createsend/client');

const apiKey = process.env.CREATESEND_API_KEY;
const clientId = process.env.CREATESEND_CLIENT_ID;
const listId = process.env.CREATESEND_LIST_ID;

module.exports = (robot) => {
  const createSend = CreateSend({ apiKey });

  // Subscribe an email address
  robot.respond(/(?:createsend|cm) subscribe (.+@.+)/i, async (message) => {
    const emailAddress = message.match[1];
    message.reply(`Attempting to subscribe ${emailAddress}...`);

    const params = {
      email_address: emailAddress,
      status: 'subscribed',
    };

    await createSend.subscribers.addSingleSubscriber(listId, params)
      .then((jsonResponse) => {
        robot.logger.debug(jsonResponse);
        return message.send(`You successfully subscribed ${emailAddress}.`);
      })
      .catch((error) => {
        robot.logger.error(error);
        return message.send(`Uh oh, something went wrong: ${error.message}`);
      });
  });

  // Unsubscribe an email address
  robot.respond(/(?:createsend|cm) unsubscribe (.+@.+)/i, async (message) => {
    const emailAddress = message.match[1];
    message.reply(`Attempting to unsubscribe ${emailAddress}...`);
    await createSend.subscribers.deleteSubscriber(listId, emailAddress)
      .then((jsonResponse) => {
        robot.logger.debug(jsonResponse);
        message.send(`You successfully unsubscribed ${emailAddress}.`);
      })
      .catch((error) => {
        robot.logger.error(error);
        message.send(`Uh oh, something went wrong: ${error.message}`);
      });
  });

  // Get statistics for last campaign
  robot.respond(/createsend$/i, async (message) => {
    await createSend.clients.getSentCampaigns(clientId, {
      page: 1,
      pageSize: 1,
      orderDirection: 'desc',
    })
      .then(async (jsonResponse) => {
        robot.logger.debug(jsonResponse);
        const campaigns = jsonResponse.data;
        // Get the first campaign in the list
        if (campaigns.length > 0) {
          const campaign = campaigns[0];
          await createSend.campaigns.getCampaignSummary(campaign.campaignId)
            .then((report) => {
              robot.logger.debug(report);
              message.send(`Last campaign "${campaign.name}" was sent to ${report.data.recipients} subscribers (${report.data.uniqueOpened} opened, ${report.data.clicks} clicked, ${report.data.unsubscribed} unsubscribed)`);
            });
        } else {
          message.send('No recent campaigns sent.');
        }
      })
      .catch((error) => {
        robot.logger.error(error);
        message.send(`Uh oh, something went wrong: ${error.message}`);
      });
  });
};
