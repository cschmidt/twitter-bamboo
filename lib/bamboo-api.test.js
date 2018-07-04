'use strict'
/* global test */
/* global expect */

const Bamboo = require('./bamboo-api')

// const Api = new Bamboo({ subdomain, apiKey })

// Api.employees().then(employees => {
//   for (const employee of employees) {
//     if (employee.status === 'Active' && employee.twitterFeed) {
//       console.log(employee.twitterFeed)
//     }
//   }
// })

test('enforces required constructor params', () => {
  expect(() => new Bamboo()).toThrow('apiKey')
  expect(() => new Bamboo({})).toThrow('apiKey')
  expect(() => new Bamboo({ apiKey: 'key' })).toThrow('subdomain')
  expect(() => new Bamboo({ apiKey: 'key', subdomain: 'subdomain' })).toBeTruthy()
})
