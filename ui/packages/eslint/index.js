module.exports = {
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true,
    },
  },
  'extends': [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  'plugins': [
    '@typescript-eslint',
    'editorconfig',
    'import',
    'react',
  ],
  'settings': {
    'import/parsers': {
      '@typescript-eslint/parser': [
        '.ts',
        '.tsx',
      ],
    },
    'import/resolver': {
      'typescript': {},
    },
    'react': {
      'version': '17',
    },
  },
  'rules': {
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'semi': [
      'error',
      'always',
    ],
    'indent': [
      'error',
      2,
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        'max': 2,
      },
    ],
    'space-before-function-paren': [
      'error',
      {
        'anonymous': 'never',
        'named': 'never',
        'asyncArrow': 'always',
      },
    ],
    'quotes': [
      'error',
      'single',
    ],
    'sort-imports': [
      'error',
      {
        'ignoreDeclarationSort': true,
      },
    ],
    'import/newline-after-import': [
      'error',
      {
        'count': 2,
      },
    ],
    'import/order': [
      'error',
      {
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true,
        },
        'newlines-between': 'always',
        'groups': [
          [
            'builtin',
            'external',
          ],
          'internal',
          'parent',
          [
            'sibling',
            'index',
          ],
        ],
        'pathGroups': [
          {
            'pattern': '~/**',
            'group': 'internal',
          },
        ],
        'pathGroupsExcludedImportTypes': [
          'builtin',
        ],
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/jsx-one-expression-per-line': [
      'error',
      {
        'allow': 'none',
      },
    ],
    'react/jsx-max-props-per-line': [
      'error',
      {
        'maximum': 1,
      },
    ],
    'react/jsx-first-prop-new-line': [
      'error',
      'multiline',
    ],
    'react/jsx-closing-bracket-location': [
      'error',
      {
        'nonEmpty': 'tag-aligned',
      },
    ],
  },
  'overrides': [
    {
      'files': [
        '*.js',
      ],
      'rules': {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      'files': [
        '*.ts',
        '*.tsx',
      ],
      'rules': {
        'import/default': 'off',
        'import/no-named-as-default-member': 'off',
        'import/no-unresolved': 'off',
      },
    },
  ],
};
