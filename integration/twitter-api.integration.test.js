'use strict'
/* global test expect beforeAll*/
const { loadConfig } = require('../lib/util')
const config = {}
const Twitter = require('../lib/twitter-api')

beforeAll(() => {
  return loadConfig().then(loaded_config => {
    Object.assign(config, loaded_config)
  })
})


test('gets list members from Twitter', () => {
  let api = new Twitter(config.twitter)
  return api.listMembers().then(listMembers => {
    expect(listMembers.length).toBeGreaterThan(0)
    for (const attributeName of ['id', 'name', 'screen_name']) {
      expect(listMembers[0][attributeName]).toBeTruthy()
    }
  })
})
