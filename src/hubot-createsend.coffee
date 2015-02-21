# Description:
#   Manage your Campaign Monitor account via Hubot
#
# Dependencies:
#   "createsend-node": "~0.7"
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

CampaignMonitor = require('createsend-node');
auth = apiKey: process.env.CREATESEND_API_KEY

module.exports = (robot) ->
  robot.respond /(createsend|cm) subscribe (.+@.+)/i, (msg) ->
    subscribeToList msg
  robot.respond /(createsend|cm) unsubscribe (.+@.+)/i, (msg) ->
    unsubscribeFromList msg
  robot.respond /(createsend|cm)$/i, (msg) ->
    latestCampaign msg

subscribeToList = (msg) ->
  emailAddress = msg.match[1]
  msg.reply "Attempting to subscribe #{emailAddress}..."

  try
    api = new CampaignMonitor(auth);
  catch err
    console.log err.msg
    return

  api.subscribers.addSubscriber process.env.CREATESEND_LIST_ID, emailAddress, (err, data) ->
    if err
      msg.send "Uh oh, something went wrong: #{err.msg}"
    else
      msg.send "You successfully subscribed #{emailAddress}."

unsubscribeFromList = (msg) ->
  emailAddress = msg.match[1]
  msg.reply "Attempting to unsubscribe #{emailAddress}..."

  try
    api = new CampaignMonitor(auth);
  catch err
    console.log err.msg
    return

  api.subscribers.deleteSubscriber process.env.CREATESEND_LIST_ID, emailAddress, (err, data) ->
    if err
      msg.send "Uh oh, something went wrong: #{err.msg}"
    else
      msg.send "You successfully unsubscribed #{emailAddress}."

latestCampaign = (msg) ->

  try
    api = new CampaignMonitor(auth);
  catch err
    console.log err.msg
    return

  api.clients.getSentCampaigns { clientId: process.env.CREATESEND_CLIENT_ID }, (err, data) ->
    if err
      msg.send "Uh oh, something went wrong: #{err.msg}"
    else
      # Get the first campaign in the list
      cid = data['data'][0]['CampaignID']
      campaign_name = data['data'][0]['Name']

      api.campaigns.getSummary cid, (err, data) ->
        if err
          msg.send "Uh oh, something went wrong: #{err.msg}"
        else
          msg.send "Last campaign \"#{campaign_name}\" was sent to #{data['Recipients']} subscribers (#{data['UniqueOpened']} opened, #{data['Clicks']} clicked, #{data['Unsubscribed']} unsubscribed)"
