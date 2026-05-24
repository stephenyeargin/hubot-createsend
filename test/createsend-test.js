const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const nock = require('nock');
const { createTestBot } = require('./common/TestBot');

describe('createsend basic operations', () => {
  describe('subscribe a user', () => {
    let bot;

    before(async () => {
      bot = await createTestBot();
      nock('https://api.createsend.com')
        .post('/api/v3.3/subscribers/123foo456.json')
        .replyWithFile(200, 'test/fixtures/subscriber-subscribed.json', { 'Content-Type': 'application/json' });
    });

    after(() => {
      bot.shutdown();
    });

    it('hubot responds with acknowledgement then confirmation', async () => {
      const reply = await bot.sendAndWaitForResponse('@hubot createsend subscribe johndoe@example.com', 'reply');
      assert.equal(reply, 'Attempting to subscribe johndoe@example.com...');

      const confirmation = await bot.sendAndWaitForResponse('@hubot createsend subscribe johndoe@example.com', 'send');
      assert.ok(confirmation.includes('subscribed') || confirmation.includes('johndoe@example.com'));
    });
  });

  describe('subscribe a user - reply then send', () => {
    let bot;

    before(async () => {
      bot = await createTestBot();
    });

    after(() => {
      bot.shutdown();
    });

    it('hubot replies with attempting message and sends success', async () => {
      nock('https://api.createsend.com')
        .post('/api/v3.3/subscribers/123foo456.json')
        .replyWithFile(200, 'test/fixtures/subscriber-subscribed.json', { 'Content-Type': 'application/json' });

      await bot.send('@hubot createsend subscribe johndoe@example.com');

      assert.equal(bot.replies.length, 1);
      assert.equal(bot.replies[0], 'Attempting to subscribe johndoe@example.com...');
      assert.equal(bot.sends.length, 1);
      assert.equal(bot.sends[0], 'You successfully subscribed johndoe@example.com.');
    });
  });

  describe('unsubscribe a user', () => {
    let bot;

    before(async () => {
      bot = await createTestBot();
    });

    after(() => {
      bot.shutdown();
    });

    it('hubot replies with attempting message and sends success', async () => {
      nock('https://api.createsend.com')
        .delete('/api/v3.3/subscribers/123foo456.json?email=johndoe%40example.com')
        .reply(200);

      await bot.send('@hubot createsend unsubscribe johndoe@example.com');

      assert.equal(bot.replies.length, 1);
      assert.equal(bot.replies[0], 'Attempting to unsubscribe johndoe@example.com...');
      assert.equal(bot.sends.length, 1);
      assert.equal(bot.sends[0], 'You successfully unsubscribed johndoe@example.com.');
    });
  });

  describe('get latest campaign stats', () => {
    let bot;

    before(async () => {
      bot = await createTestBot();
    });

    after(() => {
      bot.shutdown();
    });

    it('hubot responds with campaign summary', async () => {
      nock('https://api.createsend.com')
        .get('/api/v3.3/clients/foobarbaz123456/campaigns.json')
        .query({
          page: '1',
          pageSize: '1',
          orderDirection: 'desc',
        })
        .replyWithFile(200, 'test/fixtures/campaigns.json', { 'Content-Type': 'application/json' });
      nock('https://api.createsend.com')
        .get('/api/v3.3/campaigns/fc0ce7105baeaf97f47c99be31d02a91/summary.json')
        .replyWithFile(200, 'test/fixtures/campaign-summary.json', { 'Content-Type': 'application/json' });

      await bot.send('@hubot createsend');

      assert.equal(bot.sends.length, 1);
      assert.equal(
        bot.sends[0],
        'Last campaign "Campaign One" was sent to 1000 subscribers (298 opened, 132 clicked, 43 unsubscribed)'
      );
    });
  });
});
