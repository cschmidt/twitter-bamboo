'use strict'

const ssm = require('aws-ssm-params')

const defaultConfigPath = '../config.json'

class ConfigLoader {

  constructor(configPath) {
    this.configPath = configPath || defaultConfigPath
  }

  fetchBambooApiKey(config) {
    return ssm(config.ssm).then(params => {
      config.bamboo.apiKey = params['bamboo-api-key']
      return config
    })
  }

  load() {
    try {
      this.config = require(this.configPath)
      return this.fetchBambooApiKey(this.config).then(this.config)
    }
    catch (e) {
      throw new Error(`Couldn\'t load #{this.configPath}. See \'config_sample.json\' for instructions.`)
    }
  }
}


function loadConfig(configPath) {
  let loader = new ConfigLoader(configPath)
  return loader.load()
}

module.exports = { loadConfig }
