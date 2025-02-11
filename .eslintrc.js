// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // Basic
    'quotes': ['error', 'single'],
    'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 1 }],
    'no-multi-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'computed-property-spacing': ['error', 'never'],
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': ['error', 'always'],
    'no-trailing-spaces': 'error',
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'keyword-spacing': ['error', { before: true, after: true }],
    'padded-blocks': ['error', 'never'],
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'space-in-parens': ['error', 'never'],
    'semi': ['error', 'always'],
    // TypeScript
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    // Import
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-cycle': 'error',
    'import/no-unresolved': 'off',
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'unknown'],
        'alphabetize': {
          'order': 'asc',
        },
        'pathGroups': [
          {
            'pattern': './styles',
            'group': 'unknown',
            'position': 'after',
            'patternOptions': {
              'matchBase': true,
            },
          },
        ],
      },
    ],
  },
};
