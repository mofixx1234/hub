/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src/tests'],
  testMatch: ['**/*.test.jsx', '**/*.test.js'],
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest-setup.js'],
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/src/tests/__mocks__/styleMock.js',
  },
};
