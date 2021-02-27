module.exports = {
    parser: '@typescript-eslint/parser',

    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },

    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],

    plugins: ['@typescript-eslint'],

    rules: {
        // Specify any specific ESLint rules.
    },

    overrides: [
        {
            files: ['./*.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
    ],
};
