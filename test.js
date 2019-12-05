const assert = require('assert')
const babel = require('@babel/core')
const { TestDirector } = require('test-director')
const babelPluginTransformRequireExtensions = require('.')

const testDirector = new TestDirector()

testDirector.add('`extension` option, default.', () => {
  assert.strictEqual(
    babel.transform('require("a.mjs");', {
      plugins: [babelPluginTransformRequireExtensions]
    }).code,
    'require("a.js");'
  )
})

testDirector.add('`extension` option, one extension.', () => {
  assert.strictEqual(
    babel.transform('require("a.a");', {
      plugins: [
        [
          babelPluginTransformRequireExtensions,
          {
            extensions: {
              '.a': '.b'
            }
          }
        ]
      ]
    }).code,
    'require("a.b");'
  )
})

testDirector.add('`extension` option, multiple extensions.', () => {
  assert.strictEqual(
    babel.transform('require("a.aa");\n\nrequire("a.ba");', {
      plugins: [
        [
          babelPluginTransformRequireExtensions,
          {
            extensions: {
              '.aa': '.ab',
              '.ba': '.bb'
            }
          }
        ]
      ]
    }).code,
    'require("a.ab");\n\nrequire("a.bb");'
  )
})

testDirector.add('Period in filename.', () => {
  assert.strictEqual(
    babel.transform('require("a.b.mjs");', {
      plugins: [
        [
          babelPluginTransformRequireExtensions,
          {
            extensions: {
              '.mjs': '.js'
            }
          }
        ]
      ]
    }).code,
    'require("a.b.js");'
  )
})

testDirector.add('Unspecified extensions preserved.', () => {
  assert.strictEqual(
    babel.transform('require("a.json");', {
      plugins: [
        [
          babelPluginTransformRequireExtensions,
          {
            extensions: {
              '.mjs': '.js'
            }
          }
        ]
      ]
    }).code,
    'require("a.json");'
  )
})

testDirector.run()