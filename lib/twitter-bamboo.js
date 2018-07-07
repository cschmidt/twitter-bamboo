'use strict'

const Bamboo = new BambooApi()
const Twitter = new TwitterApi()
const twitterListName = 'unbounce-peeps'

// get list of Twitter screen names from Bamboo

function extractScreenNames(employees) {

}

function parseTwitterScreenname(twitterFeed) {
  // could be either @name, name or http://twitter.com/name

}


Bamboo.employees()
  .then(employees => { const bambooList = extractScreenNames(employees) })

// get list members from named Twitter list
Twitter.listMembers(twitterListName)
  .then(listMembers => { const twitterList = extractScreenNames(listMembers) })

// figure out new members to add
// any screen names that exist in the Bamboo list but not in the Twitter list
// need to be added
const membersToAdd = _.difference(bambooList, twitterList)

// figure out members to remove
const membersToRemove = _.difference(twitterList, bambooList)


// what if it's a dry run?

// what if someone doesn't want to remove old members?

// lists cannot have more than 5,000 members.
// https://developer.twitter.com/en/docs/accounts-and-users/create-manage-lists/api-reference/post-lists-members-create
// add one member at a time

// https://developer.twitter.com/en/docs/accounts-and-users/create-manage-lists/api-reference/post-lists-members-destroy
// remove one member at a time
