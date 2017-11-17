Helper = require('hubot-test-helper')
chai = require 'chai'
nock = require 'nock'
fs = require 'fs'

expect = chai.expect

helper = new Helper('../src/createsend.coffee')

describe 'createsend basic operations', ->
  beforeEach ->
    process.env.CREATESEND_API_KEY = 'foo123bar456baz'
    process.env.CREATESEND_CLIENT_ID = 'foobarbaz123456'
    process.env.CREATESEND_LIST_ID = '123foo456'

    @room = helper.createRoom()

    do nock.disableNetConnect

    nock('https://api.createsend.com')
      .get("/api/v3/clients/foobarbaz123456/campaigns.json")
      .reply 200, fs.readFileSync('test/fixtures/campaigns.json')

    nock('https://api.createsend.com')
      .get("/api/v3/campaigns/fc0ce7105baeaf97f47c99be31d02a91/summary.json")
      .reply 200, fs.readFileSync('test/fixtures/campaign-summary.json')

    nock('https://api.createsend.com')
      .post("/api/v3/subscribers/123foo456.json")
      .reply 200, fs.readFileSync('test/fixtures/subscriber-subscribed.json')

    nock('https://api.createsend.com')
      .delete("/api/v3/subscribers/123foo456.json?email=johndoe%40example.com")
      .reply 200

  afterEach ->
    @room.destroy()

  # Test case
  it 'returns campaign statistics', () ->
    selfRoom = @room
    testPromise = new Promise (resolve, reject) ->
      selfRoom.user.say('alice', '@hubot createsend')
      setTimeout(() ->
        resolve()
      , 1000)

    testPromise.then (result) ->
      expect(selfRoom.messages).to.eql [
        ['alice', '@hubot createsend']
        ['hubot', "Last campaign \"Campaign One\" was sent to 1000 subscribers (298 opened, 132 clicked, 43 unsubscribed)"]
      ]

  it 'subscribes a user', () ->
    selfRoom = @room
    testPromise = new Promise (resolve, reject) ->
      selfRoom.user.say('alice', '@hubot createsend subscribe johndoe@example.com')
      setTimeout(() ->
        resolve()
      , 1000)

    testPromise.then (result) ->
      expect(selfRoom.messages).to.eql [
        ['alice', '@hubot createsend subscribe johndoe@example.com']
        ['hubot', "@alice Subscribing johndoe@example.com ..."]
        ['hubot', "Subscribed johndoe@example.com."]
      ]

  it 'unsubscribes a user', () ->
    selfRoom = @room
    testPromise = new Promise (resolve, reject) ->
      selfRoom.user.say('alice', '@hubot createsend unsubscribe johndoe@example.com')
      setTimeout(() ->
        resolve()
      , 1000)

    testPromise.then (result) ->
      expect(selfRoom.messages).to.eql [
        ['alice', '@hubot createsend unsubscribe johndoe@example.com']
        ['hubot', "@alice Unsubscribing johndoe@example.com ..."]
        ['hubot', "Unsubscribed johndoe@example.com."]
      ]
