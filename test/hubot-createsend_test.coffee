chai = require 'chai'
sinon = require 'sinon'
chai.use require 'sinon-chai'

expect = chai.expect

describe 'hello-world', ->
  beforeEach ->
    @robot =
      respond: sinon.spy()
      hear: sinon.spy()

    require('../src/hubot-createsend')(@robot)

  it 'registers a createsend subscribe listener', ->
    expect(@robot.respond).to.have.been.calledWith(/(createsend|cm) subscribe (.+@.+)/i)

  it 'registers a createsend unsubscribe listener', ->
    expect(@robot.respond).to.have.been.calledWith(/(createsend|cm) unsubscribe (.+@.+)/i)

  it 'registers a createsend last campaign listener', ->
    expect(@robot.respond).to.have.been.calledWith(/(createsend|cm)$/i)