'use strict'
const request = require('request-promise-native')

const reportXml =
  `<report>
    <title>Twitter Feed List</title>
    <fields>
      <field id="firstName" />
      <field id="lastName" />
      <field id="twitterFeed" />
      <field id="status" />
    </fields>
  </report>`


class BambooApi {
  constructor(params) {
    this.requireParams(['apiKey', 'subdomain'], params)
    this.auth = 'Basic ' + new Buffer(params.apiKey + ':').toString('base64')
    this.reportsUrl = `https://api.bamboohr.com/api/gateway.php/${params.subdomain}/v1/reports/custom?format=json`
  }

  employees() {
    return request({
      method: 'POST',
      uri: this.reportsUrl,
      headers: {
        Authorization: this.auth,
        'Content-Type': 'text/xml',
        'Content-Length': Buffer.byteLength(reportXml)
      },
      body: reportXml
    }).then(response => {
      return JSON.parse(response).employees
    })
  }

  requireParams(paramNames, params) {
    for (const paramName of paramNames) {
      if (!(params && params[paramName])) {
        throw new Error(`Must specify '${paramName}' param`)
      }
    }
  }
}

module.exports = BambooApi
