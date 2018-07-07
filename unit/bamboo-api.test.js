'use strict'
/* global test */
/* global expect */
// FIXME: ugh, is there an alternative to relative pathing?
const Bamboo = require('../lib/bamboo-api')


test('enforces required constructor params', () => {
  expect(() => new Bamboo()).toThrow('apiKey')
  expect(() => new Bamboo({})).toThrow('apiKey')
  expect(() => new Bamboo({ apiKey: 'key' })).toThrow('subdomain')
  expect(() => new Bamboo({ apiKey: 'key', subdomain: 'subdomain' })).toBeTruthy()
})
