# Hubot CreateSend (Campaign Monitor)

Manage your Campaign Monitor account via Hubot

[![Build Status](https://travis-ci.org/stephenyeargin/hubot-createsend.png)](https://travis-ci.org/stephenyeargin/hubot-createsend)

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
user> hubot createsend
hubot> Last campaign "April 2015 Newsletter" was sent to 4388 subscribers (902 opened, 306 clicked, 21 unsubscribed)
```

### `hubot createsend subscribe <email>`

Add an email address to the list.

```
user> hubot createsend subscribe stephen@example.com
hubot> Attempting to subscribe stephen@example.com...
hubot> You successfully subscribed stephen@example.com.
```

### `hubot createsend unsubscribe <email>`

Remove an email address from the list.

```
user> hubot createsend unsubscribe stephen@example.com
hubot> Attempting to unsubscribe stephen@example.com...
hubot> You successfully unsubscribed stephen@example.com.
```
