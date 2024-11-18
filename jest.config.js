module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.ts'],
    moduleNameMapper: {
      '@libs/(.*)': '<rootDir>/src/libs/$1',
      '@functions/(.*)': '<rootDir>/src/functions/$1',
    },
  };