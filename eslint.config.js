// eslint.config.js
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    settings: {
      'import/resolver': {
        node: {
          paths: ['src'], // Đảm bảo ESLint hiểu alias bắt đầu từ src/
        },
      },
    },
    ignores: ['dist/*'],
  },
]);
