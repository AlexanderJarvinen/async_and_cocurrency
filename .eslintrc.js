export default {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
    commonjs: true,
  },
  plugins: ['simple-import-sort'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'warn',

    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        trailingComma: 'all',
      },
    ],

    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'css/use-baseline': 'off',
  },
};
