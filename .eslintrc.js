export default {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
    commonjs: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'warn',
    'prettier/prettier': ['error', { semi: false, singleQuote: true }],
    'css/use-baseline': 'off',
  },
}
