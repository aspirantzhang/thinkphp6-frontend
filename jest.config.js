module.exports = {
  testURL: 'http://localhost:8000',
  // testEnvironment: './tests/PuppeteerEnvironment',
  preset: 'jest-puppeteer',
  verbose: false,
  setupFilesAfterEnv: ['./tests/setupTests.js'],
  testTimeout: 6000000,
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: false,
    localStorage: null,
  },
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: [
    'node_modules',
    '.umi',
    'services',
    '.test.tsx',
    '.test.ts',
    '.d.ts',
    'antd-test-setup.js',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@@/(.*)$': '<rootDir>/src/.umi/$1',
  },
};
