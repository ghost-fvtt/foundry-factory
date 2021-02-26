module.exports = {
  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 2020,
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },

  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],

  plugins: ['@typescript-eslint'],
};
