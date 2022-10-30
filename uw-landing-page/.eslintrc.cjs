/* eslint-env node */
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    // 'standard',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'semi': ['error', 'never'],
    'indent': ['error', 2],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'operator-linebreak': ['error', 'before'],
    'comma-dangle': ['error', 'always-multiline'],
    'quotes': ['error', 'single'],
    'quote-props': ['error', 'consistent-as-needed'],
    'arrow-parens': ['error', 'as-needed'],
    'object-curly-spacing': ['error', 'always'],
    'vue/multi-word-component-names': 'off',
    'vue/require-v-for-key': 'off',
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
