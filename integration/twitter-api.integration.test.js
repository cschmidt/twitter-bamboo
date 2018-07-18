'use strict'
/* global test expect */
const config = require('../config.json')
const Twitter = new(require('../lib/twitter-api'))(config.twitter)


test('gets list members from Twitter', () => {
  return Twitter.listMembers().then(listMembers => {
    expect(listMembers.length).toBeGreaterThan(0)
    for (const attributeName of ['id', 'name', 'screen_name']) {
      expect(listMembers[0][attributeName]).toBeTruthy()
    }
  })
})
