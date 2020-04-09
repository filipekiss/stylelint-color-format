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
      description: 'Valid RGB Color',
    },
    {
      code: '.hsla-color { color: hsl(328, 100%, 44%); }',
      description: 'Valid HSL Color',
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
    {
      code: '.hex-color-border { border: 6px solid #222 ); } ',
      message: 'Unexpected hex color "#222" (color-format/format)',
      description: 'Valid short hex color in shorthand property',
      line: 1,
      column: 39,
    },
  ],
});

testRule(format, {
  ruleName: format.ruleName,
  config: {
    format: 'rgb',
    message: 'Custom Error Message',
  },

  reject: [
    {
      code: '.hex-color { color: #222 ); } ',
      message: 'Custom Error Message (color-format/format)',
      description: 'Valid short hex color',
      line: 1,
      column: 21,
    },
  ],
});
