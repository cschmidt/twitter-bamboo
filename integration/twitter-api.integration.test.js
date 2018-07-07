'use strict'
/* global test expect */
const config = require('../config.json')
const Twitter = require('../lib/twitter-api')


test('gets list members from Twitter', () => {
  const Api = new Twitter(config.twitter)
  return Api.listMembers().then(listMembers => {
    // let { id, name, screen_name } = listMembers[0]
    // console.log(id, name, screen_name)
    expect(listMembers.length).toBeGreaterThan(0)
  })
})
