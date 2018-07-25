'use strict'
/* global test */
/* global expect */

const { loadConfig } = require('../lib/config')

test('loads a config file', () => {
  return loadConfig().then(config => {
    for (const configItem of ['ssm', 'bamboo', 'twitter'])
      expect(Object.keys(config)).toContain(configItem)
  })
})

test('throws a reasonable error if config is missing', () => {
  expect(() => loadConfig('../definitely-not-a-real-file.json'))
    .toThrow('Couldn\'t load')
})
