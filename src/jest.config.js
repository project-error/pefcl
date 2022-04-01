const tsconfig = require('./server/tsconfig.json');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'server',
  moduleNameMapper,
  testMatch: ['**/**/*.test.ts'],
  testPathIgnorePatterns: ['<rootDir>/utils/test.ts'],
  setupFiles: ['<rootDir>/../jest.setup.js'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
