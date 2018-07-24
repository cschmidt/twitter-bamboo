'use strict'
/* global test expect beforeAll beforeEach jest */
const TwitterBamboo = require('../lib/twitter-bamboo')
const config = require('../config.json')
const ssm = require('aws-ssm-params')

let twitterBamboo = {}

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

function mockObjWithFn(functionName, impl) {
  const mock = {}
  mock[functionName] = jest.fn()
  mock[functionName].mockImplementation(impl)
  return mock
}

function bambooApiMock() {
  return mockObjWithFn('employees', () => Promise.resolve(sampleEmployees))
}

function twitterApiMock() {
  return mockObjWithFn('listMembers', () => Promise.resolve(sampleListMembers))
}

beforeAll(() => {
  return ssm(config.ssm).then(params => {
    config.bamboo.apiKey = params['bamboo-api-key']
  })
})

beforeEach(() => {
  twitterBamboo = new TwitterBamboo(config)
  twitterBamboo.bambooApi = bambooApiMock()
  twitterBamboo.twitterApi = twitterApiMock()
})

test('parses screen names', () => {
  let screenNames = ['screenName', '@screenName', 'http://twitter.com/screenName',
    'https://twitter.com/screenName'
  ]
  for (const screenName of screenNames) {
    expect(twitterBamboo.parseScreenName(screenName)).toBe('screenName')
  }
})

test('indexes employees and list members by screen name', () => {
  return twitterBamboo.exec().then(twitterBamboo => {
    expect(twitterBamboo.employeesByScreenName.size).toBe(1)
    let leslie = twitterBamboo.employeesByScreenName.get('Lesamatron')
    expect(leslie['twitterFeed']).toBe('@Lesamatron')
    expect(twitterBamboo.listMembersByScreenName.size).toBe(1)
    expect(twitterBamboo.listMembersByScreenName.get('productpartho')['name']).toBe('Partho Ghosh')
  })
})
