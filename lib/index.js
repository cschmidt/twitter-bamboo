'use strict'
const ssm = require('aws-ssm-params')
const config = require('../config.json')
const TwitterBamboo = require('./twitter-bamboo')

ssm(config.ssm).then(params => {
  config.bamboo.apiKey = params['bamboo-api-key']
  return new TwitterBamboo(config)
}).then(twitterBamboo => {
  return twitterBamboo.exec()
}).then(twitterBamboo => {
  console.log('membersToAdd', twitterBamboo.membersToAdd.length, twitterBamboo.membersToAdd)
  console.log('membersToRemove', twitterBamboo.membersToRemove.length, twitterBamboo.membersToRemove)
})
