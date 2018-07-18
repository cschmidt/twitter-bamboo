'use strict'
/* global test expect beforeAll */
const TwitterBamboo = require('../lib/twitter-bamboo')
const config = require('../config.json')
const ssm = require('aws-ssm-params')

beforeAll(() => {
  return ssm(config.ssm).then(params => {
    config.bamboo.apiKey = params['bamboo-api-key']
  })
})

test('parses screen names', () => {
  const twitterBamboo = new TwitterBamboo(config)
  let screenNames = ['screenName', '@screenName', 'http://twitter.com/screenName',
    'https://twitter.com/screenName'
  ]
  for (const screenName of screenNames) {
    expect(twitterBamboo.parseScreenName(screenName)).toBe('screenName')
  }
})

test('indexes employees and list members by screen name', () => {
  //FIXME: populate with a real test
})
