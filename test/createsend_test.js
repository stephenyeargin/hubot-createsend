/* global describe, context it, beforeEach, afterEach */

const Helper = require('hubot-test-helper');
const chai = require('chai');
chai.use(require('sinon-chai'));
const nock = require('nock');

const helper = new Helper('./../src/createsend.js');
const { expect } = chai;

describe('createsend basic operations', () => {
  let room = null;

  beforeEach(() => {
    process.env.CREATESEND_API_KEY = 'foo123bar456baz';
    process.env.CREATESEND_CLIENT_ID = 'foobarbaz123456';
    process.env.CREATESEND_LIST_ID = '123foo456';
    room = helper.createRoom();
    nock.disableNetConnect();
  });

  afterEach(() => {
    room.destroy();
    nock.cleanAll();
    delete process.env.CREATESEND_API_KEY;
    delete process.env.CREATESEND_CLIENT_ID;
    delete process.env.CREATESEND_LIST_ID;
  });

  context('subscribe a user', () => {
    beforeEach((done) => {
      nock('https://api.createsend.com')
        .post('/api/v3.3/subscribers/123foo456.json')
        .replyWithFile(200, 'test/fixtures/subscriber-subscribed.json');
      room.user.say('alice', '@hubot createsend subscribe johndoe@example.com');
      setTimeout(done, 100);
    });

    it('hubot responds with message', () => expect(room.messages).to.eql([
      ['alice', '@hubot createsend subscribe johndoe@example.com'],
      ['hubot', '@alice Attempting to subscribe johndoe@example.com...'],
      ['hubot', 'You successfully subscribed johndoe@example.com.'],
    ]));
  });

  context('unsubscribe a user', () => {
    beforeEach((done) => {
      nock('https://api.createsend.com')
        .delete('/api/v3.3/subscribers/123foo456.json?email=johndoe%40example.com')
        .reply(200);
      room.user.say('alice', '@hubot createsend unsubscribe johndoe@example.com');
      setTimeout(done, 100);
    });

    it('hubot responds with message', () => expect(room.messages).to.eql([
      ['alice', '@hubot createsend unsubscribe johndoe@example.com'],
      ['hubot', '@alice Attempting to unsubscribe johndoe@example.com...'],
      ['hubot', 'You successfully unsubscribed johndoe@example.com.'],
    ]));
  });

  context('get latest campaign stats', () => {
    beforeEach((done) => {
      nock('https://api.createsend.com')
        .get('/api/v3.3/clients/foobarbaz123456/campaigns.json')
        .query({
          page: 1,
          pageSize: 1,
          orderDirection: 'desc',
        })
        .replyWithFile(200, 'test/fixtures/campaigns.json');
      nock('https://api.createsend.com')
        .get('/api/v3.3/campaigns/fc0ce7105baeaf97f47c99be31d02a91/summary.json')
        .replyWithFile(200, 'test/fixtures/campaign-summary.json');
      room.user.say('alice', '@hubot createsend');
      setTimeout(done, 100);
    });

    it('hubot responds with message', () => expect(room.messages).to.eql([
      ['alice', '@hubot createsend'],
      ['hubot', 'Last campaign "Campaign One" was sent to 1000 subscribers (298 opened, 132 clicked, 43 unsubscribed)'],
    ]));
  });
});
