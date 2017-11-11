# Hubot CreateSend (Campaign Monitor)

[![npm version](https://badge.fury.io/js/hubot-createsend.svg)](http://badge.fury.io/js/hubot-createsend) [![Build Status](https://travis-ci.org/stephenyeargin/hubot-createsend.png)](https://travis-ci.org/stephenyeargin/hubot-createsend)

Manage your Campaign Monitor account via Hubot

## Getting Started

Campaign Monitor has provided [this helpful article](http://help.campaignmonitor.com/topic.aspx?t=206) for locating the necessary credentials in your account. This particular module is built around the idea of subscribing/unsubscribing users _one particular email list_ and viewing the latest campaigns for _one particular client_.

It is heavily inspired (and borrows some code) from the [hubot-mailchimp](https://github.com/hubot-scripts/hubot-mailchimp) module.

## Installation

In your hubot repository, run:

`npm install hubot-createsend --save`

Then add **hubot-createsend** to your `external-scripts.json`:

```json
["hubot-createsend"]
```

### Configuration

The script has three environment variables.

- `CREATESEND_API_KEY` - API key of account or particular client (recommended).
- `CREATESEND_CLIENT_ID` - Unique identifier for desired client
- `CREATESEND_LIST_ID` - Unique identifier for desired mailing list

### Heroku

```bash
heroku config:set CREATESEND_API_KEY=<Acount/Client API Key>
heroku config:set CREATESEND_CLIENT_ID=<Client ID>
heroku config:set CREATESEND_LIST_ID=<List ID>
```

### Standard

```
export CREATESEND_API_KEY=<Acount/Client API Key>
export CREATESEND_CLIENT_ID=<Client ID>
export CREATESEND_LIST_ID=<List ID>
```

## Usage

### `hubot createsend`

Returns the the statistics for the last sent campaign.

```
alice> @hubot createsend
hubot> Last campaign "Campaign One" was sent to 1000 subscribers (298 opened, 132 clicked, 43 unsubscribed)
```

### `hubot createsend subscribe <email>`

Add an email address to the list.

```
alice> @hubot createsend subscribe johndoe@example.com
hubot> @alice Subscribing johndoe@example.com ...
hubot> Subscribed johndoe@example.com.
```

### `hubot createsend unsubscribe <email>`

Remove an email address from the list.

```
alice> @hubot createsend unsubscribe johndoe@example.com
hubot> @alice Unsubscribing johndoe@example.com ...
hubot> Unsubscribed johndoe@example.com.
```
