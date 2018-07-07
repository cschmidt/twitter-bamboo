'use strict'
/* global beforeAll test expect */
const ssm = require('aws-ssm-params')
// FIXME: ugh, is there an alternative to relative pathing?
const Bamboo = require('../lib/bamboo-api')
const config = require('../config.json')


beforeAll(() => {
  return ssm(config.ssm).then(function(params) {
    config.bamboo.apiKey = params['bamboo-api-key']
  })
})


test('gets employee list from Bamboo', () => {
  const Api = new Bamboo(config.bamboo)
  return Api.employees().then(employees => {
    expect(employees.length).toBeGreaterThan(0)
    expect(Object.keys(employees[0]))
      .toEqual(['id', 'firstName', 'lastName', 'twitterFeed', 'status'])
  })
})
