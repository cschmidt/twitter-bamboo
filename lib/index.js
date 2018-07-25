'use strict'
const TwitterBamboo = require('./twitter-bamboo')
const { loadConfig } = require('./config')

loadConfig().then(config => {
  let twitterBamboo = new TwitterBamboo(config)
  return twitterBamboo.exec()
}).then(twitterBamboo => {
  console.log('membersToAdd', twitterBamboo.membersToAdd.length, twitterBamboo.membersToAdd)
  console.log('membersToRemove', twitterBamboo.membersToRemove.length, twitterBamboo.membersToRemove)
})
