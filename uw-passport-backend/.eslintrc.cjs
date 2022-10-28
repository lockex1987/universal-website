module.exports = {
  env: {
    node: true,
    es2022: true,
  },
  extends: 'standard',
  // extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'semi': ['error', 'never'],
    'indent': ['error', 2],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    }],
    'operator-linebreak': ['error', 'before'],
    'comma-dangle': ['error', 'always-multiline'],
    'quote-props': ['error', 'consistent-as-needed'],
    'arrow-parens': ['error', 'as-needed'],
    'object-curly-spacing': ['error', 'always'],
    'eqeqeq': 'off',
    'space-unary-ops': ['error', {
      words: true,
      nonwords: false, // no space before ++, --
      overrides: {
        '!': true, // space after !
      },
    }],
  },
}
