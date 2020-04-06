'use strict';

const { strictEqual } = require('assert');
const babel = require('@babel/core');
const { TestDirector } = require('test-director');
const babelPluginTransformRequireExtensions = require('.');

const tests = new TestDirector();

tests.add('`extension` option, default.', () => {
  strictEqual(
    babel.transform('require("a.mjs");', {
      plugins: [babelPluginTransformRequireExtensions],
    }).code,
    'require("a.js");'
  );
});

tests.add('`extension` option, one extension.', () => {
  strictEqual(
    babel.transform('require("a.a");', {
      plugins: [
        [
          babelPluginTransformRequireExtensions,
          {
            extensions: {
              '.a': '.b',
            },
          },
        ],
      ],
    }).code,
    'require("a.b");'
  );
});

tests.add('`extension` option, multiple extensions.', () => {
  strictEqual(
    babel.transform('require("a.aa");\n\nrequire("a.ba");', {
      plugins: [
        [
          babelPluginTransformRequireExtensions,
          {
            extensions: {
              '.aa': '.ab',
              '.ba': '.bb',
            },
          },
        ],
      ],
    }).code,
    'require("a.ab");\n\nrequire("a.bb");'
  );
});

tests.add('Period in filename.', () => {
  strictEqual(
    babel.transform('require("a.b.mjs");', {
      plugins: [
        [
          babelPluginTransformRequireExtensions,
          {
            extensions: {
              '.mjs': '.js',
            },
          },
        ],
      ],
    }).code,
    'require("a.b.js");'
  );
});

tests.add('Unspecified extensions preserved.', () => {
  strictEqual(
    babel.transform('require("a.json");', {
      plugins: [
        [
          babelPluginTransformRequireExtensions,
          {
            extensions: {
              '.mjs': '.js',
            },
          },
        ],
      ],
    }).code,
    'require("a.json");'
  );
});

tests.run();
