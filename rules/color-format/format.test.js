const {describe, it} = require('node:test');
const assert = require('node:assert/strict');
const stylelint = require('stylelint');
const plugin = require('../../index');

const ruleName = 'color-format/format';

async function lint(code, config) {
  const result = await stylelint.lint({
    code,
    config: {
      plugins: [plugin],
      rules: {
        [ruleName]: config,
      },
    },
  });
  return result;
}

describe('color-format/format with rgb config', () => {
  it('should accept valid RGB color', async () => {
    const result = await lint('.rgb-color { color: rgb(34, 34, 34); }', {
      format: 'rgb',
    });
    assert.equal(result.results[0].warnings.length, 0);
  });

  it('should accept valid HSL color', async () => {
    const result = await lint('.hsla-color { color: hsl(328, 100%, 44%); }', {
      format: 'rgb',
    });
    assert.equal(result.results[0].warnings.length, 0);
  });

  it('should reject short hex color', async () => {
    const result = await lint('.hex-color { color: #222; }', {format: 'rgb'});
    const warnings = result.results[0].warnings;
    assert.equal(warnings.length, 1);
    assert.equal(
      warnings[0].text,
      'Unexpected hex color "#222" (color-format/format)'
    );
    assert.equal(warnings[0].line, 1);
    assert.equal(warnings[0].column, 21);
  });

  it('should reject invalid hex color', async () => {
    const result = await lint('.hex-color { color: #3333; }', {format: 'rgb'});
    const warnings = result.results[0].warnings;
    assert.equal(warnings.length, 1);
    assert.equal(
      warnings[0].text,
      'Unexpected hex color "#3333" (color-format/format)'
    );
  });

  it('should reject long hex color', async () => {
    const result = await lint('.hex-color { color: #444444; }', {
      format: 'rgb',
    });
    const warnings = result.results[0].warnings;
    assert.equal(warnings.length, 1);
    assert.equal(
      warnings[0].text,
      'Unexpected hex color "#444444" (color-format/format)'
    );
    assert.equal(warnings[0].line, 1);
    assert.equal(warnings[0].column, 21);
  });

  it('should reject hex color in shorthand property', async () => {
    const result = await lint('.hex-color-border { border: 6px solid #222; }', {
      format: 'rgb',
    });
    const warnings = result.results[0].warnings;
    assert.equal(warnings.length, 1);
    assert.equal(
      warnings[0].text,
      'Unexpected hex color "#222" (color-format/format)'
    );
    assert.equal(warnings[0].line, 1);
    assert.equal(warnings[0].column, 39);
  });
});

describe('color-format/format with custom message', () => {
  it('should use custom error message', async () => {
    const result = await lint('.hex-color { color: #222; }', {
      format: 'rgb',
      message: 'Custom Error Message',
    });
    const warnings = result.results[0].warnings;
    assert.equal(warnings.length, 1);
    assert.equal(
      warnings[0].text,
      'Custom Error Message (color-format/format)'
    );
  });
});
