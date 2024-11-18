module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    '@tportio/eslint-config',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    "plugin:import/typescript",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'config/*.js', 'jest.config.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/ban-types': 'off',
    'sonarjs/no-nested-switch': 'off',
    'sonarjs/cognitive-complexity': 'off',
    'sonarjs/no-small-switch': 'off',
    'import/no-default-export': 'off',
    'no-restricted-syntax': 'off',
    'unicorn/no-array-reduce': 'off',
    'guard-for-in': 'off',
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
};
