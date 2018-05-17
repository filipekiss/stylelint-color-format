const {createPlugin} = require('stylelint');

const rules = require('./rules');

module.exports = [createPlugin('color-format/format', rules['format'])];
