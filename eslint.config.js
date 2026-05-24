const globals = require('globals');

module.exports = [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
    rules: {
    },
  },
];
