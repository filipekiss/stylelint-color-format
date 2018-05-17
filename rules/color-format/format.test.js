const testRule = require('stylelint-test-rule-tape');

const {format} = require('../');

testRule(format, {
  ruleName: format.ruleName,
  config: {
    format: 'rgb',
  },

  accept: [
    {
      code: '.rgb-color { color: rgb(34, 34, 34); }',
    },
  ],

  reject: [
    {
      code: '.hex-color { color: #222 ); } ',
      message: 'Unexpected hex color "#222" (color-format/format)',
      description: 'Valid short hex color',
      line: 1,
      column: 21,
    },
    {
      code: '.hex-color { color: #3333 ); } ',
      message: 'Unexpected hex color "#3333" (color-format/format)',
      description: 'Invalid Hex Color',
      line: 1,
      column: 21,
    },
    {
      code: '.hex-color { color: #444444 ); } ',
      message: 'Unexpected hex color "#444444" (color-format/format)',
      description: 'Valid long hex color',
      line: 1,
      column: 21,
    },
  ],
});
