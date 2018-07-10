'use strict'
const config = require('../config.json')
const ssm = require('aws-ssm-params')

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



ssm(config.ssm).then(params => {
  config.bamboo.apiKey = params['bamboo-api-key']
  context.Bamboo = new(require('./bamboo-api'))(config.bamboo)
  context.Twitter = new(require('./twitter-api'))(config.twitter)
}).then(() => {
  return Promise.all([fetchEmployees(context), fetchListMembers(context)])
}).then(() => {
  console.log(context.listMembers.length, 'listMembers', context.employees.length, 'employees')
}).then(() => {
  for (const employee of context.employees) {
    if (employee.status === 'Active' && employee.twitterFeed) {
      console.log(employee.twitterFeed)
    }
  }
})

// get list of Twitter screen names from Bamboo

function extractScreenNames(employees) {
  // screen names in Bamboo are in multiple formats:
  // http[s]://twitter.com/[screen name]
  // [screen name]
  // @[screen name]
}


// get list members from named Twitter list
// Twitter.listMembers(twitterListName)
// .then(listMembers => { const twitterList = extractScreenNames(listMembers) })

// figure out new members to add
// any screen names that exist in the Bamboo list but not in the Twitter list
// need to be added
// const membersToAdd = _.difference(bambooList, twitterList)

// figure out members to remove
// const membersToRemove = _.difference(twitterList, bambooList)


// what if it's a dry run?

// what if someone doesn't want to remove old members?

// lists cannot have more than 5,000 members.
// https://developer.twitter.com/en/docs/accounts-and-users/create-manage-lists/api-reference/post-lists-members-create
// add one member at a time

// https://developer.twitter.com/en/docs/accounts-and-users/create-manage-lists/api-reference/post-lists-members-destroy
// remove one member at a time

export { extractScreenNames }
