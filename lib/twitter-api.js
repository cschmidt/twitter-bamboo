'use strict'
const request = require('request-promise-native')


class TwitterApi {
  constructor(params) {
    this.params = params
  }

  listMembers(listName) {
    return request({
      method: 'GET',
      uri: 'https://api.twitter.com/1.1/lists/members.json',
      qs: {
        slug: this.params.list_name,
        owner_screen_name: this.params.owner_screen_name
      },
      oauth: this.params.oauth
    }).then(response => {
      return JSON.parse(response).users
    })
  }
}

module.exports = TwitterApi
