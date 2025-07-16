/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const path = require('path');

const { reuse } = require('alias-reuse');

const tsconfig = path.resolve(__dirname, 'tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  verbose: true,
  moduleNameMapper: {
    ...reuse().from(tsconfig).for('jest'),
    '(.*)\\?worker': './$1',
    '\\.(png|mp3)$': '<rootDir>/src/test/mocked-file.ts',
    '^phaser3spectorjs': require.resolve('phaser3spectorjs'),
  },
  testRegex: '\\.test\\.tsx?$',
  setupFiles: ['jest-canvas-mock'],
};
