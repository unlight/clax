module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
    },
    extends: ['eslint:recommended', 'plugin:unicorn/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
        project: 'tsconfig.json',
    },
    plugins: ['unicorn', 'import', '@typescript-eslint/tslint', 'only-warn'],
    rules: {
        'no-undef': 0,
        'no-unused-vars': 0,
        indent: 0,
        'no-dupe-class-members': 0,
        'unicorn/import-index': 0,
        'unicorn/catch-error-name': 0,
        'unicorn/prefer-spread': 0,
        'unicorn/no-fn-reference-in-iterator': 0,
        'import/newline-after-import': 0,
        'import/no-duplicates': 1,
        'import/max-dependencies': [1, { max: 10 }],
        quotes: [1, 'single', { allowTemplateLiterals: true }],
        semi: [1, 'always'],
        '@typescript-eslint/tslint/config': [
            1,
            {
                lintFile: './tslint.json',
            },
        ],
    },
    overrides: [
        {
            files: ['*.spec.{ts,tsx}', '**/testing/**/*.ts'],
            rules: {
                '@typescript-eslint/tslint/config': 0,
                'consistent-return': 0,
                'max-lines': 0,
                '@typescript-eslint/no-explicit-any': 0,
                '@typescript-eslint/no-floating-promises': 0,
                '@typescript-eslint/no-non-null-assertion': 0,
                '@typescript-eslint/camelcase': 0,
                'import/max-dependencies': 0,
                'sonarjs/no-duplicate-string': 0,
            },
        },
    ],
};
