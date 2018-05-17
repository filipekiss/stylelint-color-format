const colorConverter = require('color');
const stylelint = require('stylelint');
const styleSearch = require('style-search');

const {report, ruleMessages, validateOptions} = stylelint.utils;

const ruleName = 'color-format/format';

const fixColorFormat = (value, fixer) => {
  const color = colorConverter(value);
  if (fixer.fixTo.indexOf('hsl') > -1) {
    return color.hsl().string();
  }
  return color.rgb().string();
};

const messages = ruleMessages(ruleName, {
  rejected: hex => `Unexpected hex color "${hex}"`,
});

const rule = function(actual, options, context) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual,
      possible: {
        format: ['rgb', 'rgba', 'hsl', 'hsla'],
      },
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      const declString = decl.toString();
      const fixPositions = [];

      styleSearch({source: declString, target: '#'}, match => {
        // If there's not a colon, comma, or whitespace character before, we'll assume this is
        // not intended to be a hex color, but is instead something like the
        // hash in a url() argument
        if (!/[:,\s]/.test(declString[match.startIndex - 1])) {
          return;
        }

        const hexMatch = /^#[0-9A-Za-z]+/.exec(
          declString.substr(match.startIndex)
        );
        if (!hexMatch) {
          return;
        }
        const hexValue = hexMatch[0];

        if (context && context.fix) {
          fixPositions.unshift({
            fixTo: actual.format,
            hexValue,
            startIndex: match.startIndex,
          });

          return;
        }

        report({
          message: messages.rejected(hexValue),
          node: decl,
          index: match.startIndex,
          result,
          ruleName,
        });
      });

      if (fixPositions.length > 0) {
        fixPositions.forEach(fixPosition => {
          decl.value = fixColorFormat(decl.value, fixPosition);
        });
      }
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
