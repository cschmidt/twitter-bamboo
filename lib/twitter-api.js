'use strict'
const request = require('request-promise-native')


class TwitterApi {
  constructor(params) {
    // FIXME: assert required params
    this.params = params
  }

  listMembers(listName, listMembers, nextCursor) {
    return request({
      method: 'GET',
      uri: 'https://api.twitter.com/1.1/lists/members.json',
      qs: {
        slug: this.params.list_name,
        owner_screen_name: this.params.owner_screen_name,
        cursor: nextCursor || -1
      },
      oauth: this.params.oauth
    }).then(response => {
      if (!listMembers) {
        listMembers = []
      }
      let parsedResponse = JSON.parse(response)
      listMembers = listMembers.concat(parsedResponse.users)
      if (parsedResponse.next_cursor > 0) {
        return this.listMembers(listName, listMembers, parsedResponse.next_cursor)
      }
      else {
        return listMembers
      }
    })
  }
}

module.exports = TwitterApi
