'use strict'
/* global beforeAll test expect */
// FIXME: ugh, is there an alternative to relative pathing?
const { loadConfig } = require('../lib/util')
const config = {}
const Bamboo = require('../lib/bamboo-api')

beforeAll(() => {
  return loadConfig().then(loaded_config => {
    Object.assign(config, loaded_config)
  })
})

test('gets employee list from Bamboo', () => {
  const api = new Bamboo(config.bamboo)
  return api.employees().then(employees => {
    expect(employees.length).toBeGreaterThan(0)
    expect(Object.keys(employees[0]))
      .toEqual(['id', 'firstName', 'lastName', 'twitterFeed', 'status'])
  })
})
