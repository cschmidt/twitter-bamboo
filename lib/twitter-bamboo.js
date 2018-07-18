'use strict'
const _ = require('lodash')

class TwitterBamboo {
  constructor(config) {
    this.bambooApi = new(require('./bamboo-api'))(config.bamboo)
    this.twitterApi = new(require('./twitter-api'))(config.twitter)
  }

  exec() {
    return Promise.all([
      this.fetchBambooEmployees(),
      this.fetchTwitterListMembers()
    ]).then(() => {
      return this.computeListOperations()
    })
  }

  fetchBambooEmployees() {
    return this.bambooApi.employees().then(employees => {
      this.employees = employees
    })
  }

  fetchTwitterListMembers() {
    return this.twitterApi.listMembers().then(listMembers => {
      this.listMembers = listMembers
    })
  }

  parseScreenName(s) {
    // screen names in Bamboo are in multiple formats:
    // http[s]://twitter.com/[screen name]
    // [screen name]
    // @[screen name]
    return s.split(/\/|@/).pop()
  }

  indexByAttribute(items, getKey) {
    let indexedMap = new Map()
    for (const item of items) {
      let key = getKey(item)
      if (key) indexedMap.set(key, item)
    }
    return indexedMap
  }

  computeListOperations() {
    this.employeesByScreenName = this.indexByAttribute(
      this.employees,
      employee => employee.twitterFeed && this.parseScreenName(employee.twitterFeed)
    )
    this.listMembersByScreenName = this.indexByAttribute(
      this.listMembers,
      listMember => listMember.screen_name
    )
    // figure out new members to add
    // any screen names that exist in the Bamboo list but not in the Twitter list
    // need to be added
    this.membersToAdd =
      _.difference(
        Array.from(this.employeesByScreenName.keys()),
        Array.from(this.listMembersByScreenName.keys()))
    // figure out members to remove
    this.membersToRemove =
      _.difference(
        Array.from(this.listMembersByScreenName.keys()),
        Array.from(this.employeesByScreenName.keys()))
    return this
  }
}

// what if it's a dry run?

// what if someone doesn't want to remove old members?

// what if you want to maintain two separate lists; an 'active' list and an
// 'alumni' list?

// lists cannot have more than 5,000 members.
// https://developer.twitter.com/en/docs/accounts-and-users/create-manage-lists/api-reference/post-lists-members-create
// add one member at a time

// https://developer.twitter.com/en/docs/accounts-and-users/create-manage-lists/api-reference/post-lists-members-destroy
// remove one member at a time

module.exports = TwitterBamboo
