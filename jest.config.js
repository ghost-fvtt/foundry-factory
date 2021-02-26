export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/test/tsconfig.test.json',
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '/template/'],
};
