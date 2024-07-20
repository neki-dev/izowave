const { reuse } = require('alias-reuse');
const path = require('path');

const tsconfig = path.resolve(__dirname, 'tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  verbose: true,
  moduleNameMapper: {
    ...reuse().from(tsconfig).for('jest'),
    '(.*)\\?worker': './$1',
    '^phaser3spectorjs': require.resolve('phaser3spectorjs'),
  },
  testRegex: '\\.test\\.tsx?$',
  setupFiles: ['jest-canvas-mock'],
};
