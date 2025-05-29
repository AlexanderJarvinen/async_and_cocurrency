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
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        trailingComma: 'all', // ← добавь это
      },
    ],
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'css/use-baseline': 'off',
  },
};
