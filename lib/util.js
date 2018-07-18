'use strict'

const ssm = require('aws-ssm-params')

function fetchBambooApiKey(config) {
  return ssm(config.ssm).then(params => {
    config.bamboo.apiKey = params['bamboo-api-key']
    return config
  })
}

function loadConfig() {
  try {
    let config = require('../config.json')
    return fetchBambooApiKey(config).then(config)
  }
  catch (e) {
    console.log(e, 'Couldn\'t load config.json. See \'config_sample.json\' for instructions.')
    process.exit(-1)
  }
}

module.exports = { loadConfig }
