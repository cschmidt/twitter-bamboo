'use strict'
/* global test expect beforeAll jest */
const TwitterBamboo = require('../lib/twitter-bamboo')
const config = require('../config.json')
const ssm = require('aws-ssm-params')

const sampleEmployees = [{
  id: 'id1',
  firstName: 'Leslie',
  lastName: 'Collin',
  twitterFeed: '@Lesamatron',
  status: 'Active'
}, {
  id: 'id2',
  firstName: 'Sheldi',
  lastName: 'St. Amand',
  twitterFeed: null,
  status: 'Inactive'
}]

const sampleListMembers = [{
  id: 3796643658,
  name: 'Partho Ghosh',
  screen_name: 'productpartho'
}]

function bambooApiMock() {
  const mock = {}
  mock.employees = jest.fn()
  mock.employees.mockImplementation(() => Promise.resolve(sampleEmployees))
  return mock
}

function twitterApiMock() {
  const mock = {}
  mock.listMembers = jest.fn()
  mock.listMembers.mockImplementation(() => Promise.resolve(sampleListMembers))
  return mock
}

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
  const twitterBamboo = new TwitterBamboo(config)
  twitterBamboo.bambooApi = bambooApiMock()
  twitterBamboo.twitterApi = twitterApiMock()

  return twitterBamboo.exec().then(twitterBamboo => {
    expect(twitterBamboo.employeesByScreenName.size).toBe(1)
    let leslie = twitterBamboo.employeesByScreenName.values().next().value
    expect(leslie['twitterFeed']).toBe('@Lesamatron')
    expect(twitterBamboo.listMembersByScreenName.size).toBe(1)
  })
})
