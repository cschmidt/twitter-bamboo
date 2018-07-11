'use strict'
const config = require('../config.json')
const ssm = require('aws-ssm-params')
const _ = require('lodash')
const context = {}

function fetchEmployees(context) {
  return context.Bamboo.employees().then(employees => {
    context.employees = employees
    console.log('loaded', employees.length, 'employees')
  })
}

function fetchListMembers(context) {
  return context.Twitter.listMembers().then(listMembers => {
    context.listMembers = listMembers
    console.log('loaded', listMembers.length, 'list members')
  })
}

function parseScreenName(s) {
  // screen names in Bamboo are in multiple formats:
  // http[s]://twitter.com/[screen name]
  // [screen name]
  // @[screen name]
  return s.split(/\/|@/).pop()
}

function indexEmployeesByScreenName(context) {
  context.employeesByScreenName = new Map()
  for (const employee of context.employees) {
    if (employee.status === 'Active' && employee.twitterFeed) {
      let screenName = parseScreenName(employee.twitterFeed)
      employee.screenName = screenName
      context.employeesByScreenName.set(screenName, employee)
    }
  }
}

function indexListMembersByScreenName(context) {
  context.listMembersByScreenName = new Map()
  for (const listMember of context.listMembers) {
    context.listMembersByScreenName.set(listMember.screen_name, listMember)
  }
}

function computeListOperations(context) {
  // figure out new members to add
  // any screen names that exist in the Bamboo list but not in the Twitter list
  // need to be added
  context.membersToAdd =
    _.difference(Array.from(context.employeesByScreenName.keys()),
      Array.from(context.listMembersByScreenName.keys()))
  console.log('membersToAdd', context.membersToAdd.length, context.membersToAdd)
  // figure out members to remove
  context.membersToRemove =
    _.difference(Array.from(context.listMembersByScreenName.keys()),
      Array.from(context.employeesByScreenName.keys()))
  console.log('membersToRemove', context.membersToRemove.length, context.membersToRemove)
}

ssm(config.ssm).then(params => {
  config.bamboo.apiKey = params['bamboo-api-key']
  context.Bamboo = new(require('./bamboo-api'))(config.bamboo)
  context.Twitter = new(require('./twitter-api'))(config.twitter)
}).then(() => {
  return Promise.all([fetchEmployees(context), fetchListMembers(context)])
}).then(() => {
  indexEmployeesByScreenName(context)
  indexListMembersByScreenName(context)
  computeListOperations(context)
})


// what if it's a dry run?

// what if someone doesn't want to remove old members?

// lists cannot have more than 5,000 members.
// https://developer.twitter.com/en/docs/accounts-and-users/create-manage-lists/api-reference/post-lists-members-create
// add one member at a time

// https://developer.twitter.com/en/docs/accounts-and-users/create-manage-lists/api-reference/post-lists-members-destroy
// remove one member at a time
