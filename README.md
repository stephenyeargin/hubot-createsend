# Hubot CreateSend (Campaign Monitor)

[![npm version](https://badge.fury.io/js/hubot-createsend.svg)](http://badge.fury.io/js/hubot-createsend) [![Build Status](https://app.travis-ci.com/stephenyeargin/hubot-createsend.png)](https://app.travis-ci.com/stephenyeargin/hubot-createsend)

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

| Environment Variable   | Required? | Description                             |
| ---------------------- | :-------: | ----------------------------------------|
| `CREATESEND_API_KEY`   | Yes       | API key of account or particular client |
| `CREATESEND_CLIENT_ID` | Yes       | Unique identifier for desired client
| `CREATESEND_LIST_ID`   | Yes       | Unique identifier for desired mailing list |

## Usage

### Get latest campaign

Returns the the statistics for the last sent campaign. You can use `hubot cm ...` if you prefer to use a few less keystrokes. 

```
alice> @hubot createsend
hubot> Last campaign "Campaign One" was sent to 1000 subscribers (298 opened, 132 clicked, 43 unsubscribed)
```

### Subscribe an email

Add an email address to the list.

```
alice> @hubot createsend subscribe johndoe@example.com
hubot> @alice Subscribing johndoe@example.com ...
hubot> Subscribed johndoe@example.com.
```

### Unsubscribe an email

Remove an email address from the list.

```
alice> @hubot createsend unsubscribe johndoe@example.com
hubot> @alice Unsubscribing johndoe@example.com ...
hubot> Unsubscribed johndoe@example.com.
```
