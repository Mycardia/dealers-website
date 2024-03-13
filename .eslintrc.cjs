module.exports = {
  root: true,
  extends: [
    '@nuxt/eslint-config',
    '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended'
  ],
  env: {
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  rules: {
    'curly': ['error', 'all'],
    'semi': ['error', 'always'],
    'vue/no-multiple-template-root': 'off',
    'quote-props': ['error', 'consistent'],
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'never',
        },
        svg: 'always',
        math: 'always',
      },
    ],
  },
};
