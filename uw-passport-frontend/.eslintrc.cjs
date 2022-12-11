module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'standard',
  ],
  globals: {
    computed: true,
    reactive: true,
    ref: true,
    onMounted: true,
    useRouter: true,
    useRoute: true,
    axios: 'readonly',
    noti: 'readonly',
    Highcharts: 'readonly',
    bootstrap: 'readonly',
    $: 'readonly',
    ExcelJS: 'readonly',
    moment: 'readonly',
  },
  rules: {
    semi: ['error', 'never'],
    indent: ['error', 2],
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
    quotes: ['error', 'single'],
    'quote-props': ['error', 'as-needed'], // consistent-as-needed
    'arrow-parens': ['error', 'as-needed'],
    'object-curly-spacing': ['error', 'always'],
    'vue/multi-word-component-names': 'off',
    'vue/require-v-for-key': 'off',
    eqeqeq: 'off',
    'space-unary-ops': ['error', {
      words: true,
      nonwords: false, // no space before ++, --
      overrides: {
        '!': true, // space after !
      },
    }],
    'no-multiple-empty-lines': 'off',
    'no-new': 'off',
  },
}
