'use strict'
/* global test expect */
// import { extractScreenNames } from 'twitter-bamboo'
var _ = require('lodash')

test('parses screen names', () => {
  let screenNames = ['screenName', '@screenName', 'http://twitter.com/screenName',
    'https://twitter.com/screenName'
  ]
  // FIXME: populate with a real test
  for (const screenName of screenNames) {
    expect(screenName.split(/\/|@/).pop()).toBe('screenName')
  }
  // expect(extractScreenNames([employee])).toBe([{ screenName: 'screenName' }])
})

test('indexes employees and list members by screen name', () => {
  let employeesByScreenName = new Map()
  employeesByScreenName.set('s1', { screenName: 's1' })
  employeesByScreenName.set('s2', { screenName: 's2' })
  employeesByScreenName.set('s4', { screenName: 's4' })

  let listMembersByScreenName = new Map()
  listMembersByScreenName.set('s2', { screenName: 's2' })
  listMembersByScreenName.set('s3', { screenName: 's3' })

  //FIXME: populate with a real test
})
