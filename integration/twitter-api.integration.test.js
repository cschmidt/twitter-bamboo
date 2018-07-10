'use strict'
/* global test expect */
const config = require('../config.json')
const Twitter = new(require('../lib/twitter-api'))(config.twitter)


test('gets list members from Twitter', () => {
  return Twitter.listMembers().then(listMembers => {
    // let { id, name, screen_name } = listMembers[0]
    // console.log(id, name, screen_name)
    console.log('Retrieved', listMembers.length, 'list members')
    expect(listMembers.length).toBeGreaterThan(0)
  })
})
