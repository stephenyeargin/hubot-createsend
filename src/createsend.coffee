# Description:
#   Manage your Campaign Monitor account via Hubot
#
# Dependencies:
#   "createsend-node": "~0.8"
#
# Configuration:
#   CREATESEND_API_KEY
#   CREATESEND_CLIENT_ID
#   CREATESEND_LIST_ID
#
# Commands:
#   hubot createsend subscribe <email> - Add email to list
#   hubot createsend unsubscribe <email> - Remove email from list
#   hubot createsend - Get statistics from latest mailing
#
# Author:
#   stephenyeargin

api_key = process.env.CREATESEND_API_KEY
client_id = process.env.CREATESEND_CLIENT_ID
list_id = process.env.CREATESEND_LIST_ID

CampaignMonitor = require('createsend-node');
auth = apiKey: api_key

module.exports = (robot) ->
  robot.respond /(createsend|cm) subscribe (.+@.+)/i, (msg) ->
    subscribeToList msg
  robot.respond /(createsend|cm) unsubscribe (.+@.+)/i, (msg) ->
    unsubscribeFromList msg
  robot.respond /(createsend|cm)$/i, (msg) ->
    latestCampaign msg

  ##
  # Subscribe an email to list
  subscribeToList = (msg) ->
    return unless checkCreatesendConfiguration msg

    email_address = msg.match[2]
    msg.reply "Attempting to subscribe #{email_address}..."

    try
      api = new CampaignMonitor(auth);
    catch err
      console.log err
      return

    api.subscribers.addSubscriber list_id, EmailAddress: email_address, (err, data) ->
      if err
        msg.send formatErrorMessage err
      else
        msg.send "You successfully subscribed #{email_address}."

  ##
  # Unsubscribe an email from list
  unsubscribeFromList = (msg) ->
    return unless checkCreatesendConfiguration msg

    email_address = msg.match[2]
    msg.reply "Attempting to unsubscribe #{email_address}..."

    try
      api = new CampaignMonitor(auth);
    catch err
      console.log err
      return

    api.subscribers.deleteSubscriber list_id, email_address, (err, data) ->
      if err
        msg.send formatErrorMessage err
      else
        msg.send "You successfully unsubscribed #{email_address}."

  ##
  # Latest Campaign Statistics
  latestCampaign = (msg) ->
    return unless checkCreatesendConfiguration msg

    try
      api = new CampaignMonitor(auth);
    catch err
      console.log err
      return

    api.clients.getSentCampaigns client_id, (err, data) ->
      if err
        msg.send formatErrorMessage err
      else
        # Get the first campaign in the list
        cid = data[0]['CampaignID']
        campaign_name = data[0]['Name']

        api.campaigns.getSummary cid, (err, data) ->
          if err
            msg.send formatErrorMessage err
          else
            msg.send "Last campaign \"#{campaign_name}\" was sent to #{data['Recipients']} subscribers (#{data['UniqueOpened']} opened, #{data['Clicks']} clicked, #{data['Unsubscribed']} unsubscribed)"

  ##
  # Check Createsend Configuration
  checkCreatesendConfiguration = (msg) ->
    unless api_key && client_id && list_id
      msg.send "You are missing one or all of [CREATESEND_API_KEY, CREATESEND_CLIENT_ID, CREATESEND_LIST_ID]"
      return false
    true

  ##
  # Format error message
  formatErrorMessage = (err) ->
    robot.logger.debug err
    if err.Message
      return "Uh oh, something went wrong: #{err.Message}"
    else
      err = err.toString().substring(0, 100)
      return "Uh oh, something went wrong: #{err}"
