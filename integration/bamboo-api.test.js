'use strict'
/* global beforeAll test expect */
const ssm = require('aws-ssm-params')
// FIXME: ugh, is there an alternative to relative pathing?
const Bamboo = require('../lib/bamboo-api')

const config = {}
const subdomain = 'unbounce'
const ssmParams = {
  Path: '/my-demo-env',
  WithDecryption: true
}


beforeAll(() => {
  return ssm(ssmParams).then(function(params) {
    config.apiKey = params['bamboo-api-key']
  })
})


test('gets employee list from Bamboo', () => {
  const Api = new Bamboo({ subdomain, apiKey: config.apiKey })
  return Api.employees().then(employees => {
    expect(employees.length).toBeGreaterThan(0)
    for (const employee of employees) {
      if (employee.status === 'Active' && employee.twitterFeed) {
        console.log(employee.twitterFeed)
      }
    }
  })
})
