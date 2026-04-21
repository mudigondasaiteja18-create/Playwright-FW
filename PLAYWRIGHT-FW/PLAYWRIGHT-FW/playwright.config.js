import { defineConfig, devices } from '@playwright/test';
import { customReporters } from './config/reporters.js';
import { getBaseURL, getEnvironmentConfig } from './config/env.js';

/**
 * Playwright Configuration for Enterprise Testing Framework
 * Supports Chromium, Firefox, and WebKit browsers
 * Integrated with Allure for advanced reporting
 * 
 * Run tests with environment:
 * npx playwright test --grep @smoke -- --env=prod
 * npx playwright test --grep @smoke -- --env=staging
 * npx playwright test --grep @smoke -- --env=beta
 */

const env = process.env.ENVIRONMENT || process.env.ENV || 'staging';
const envConfig = getEnvironmentConfig(env);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'test-reports/html', open: 'never' }],
    ['json', { outputFile: 'test-reports/results.json' }],
    ['list'],
    ['allure-playwright', {
      detail: true,
      suiteTitle: true,
      categories: [
        {
          name: 'Flaky Tests',
          match: '.*@flaky.*',
        },
        {
          name: 'Critical Tests',
          match: '.*@critical.*',
        },
      ],
    }],
  ],

  // Global timeout settings
  timeout: envConfig.timeout,
  globalTimeout: 60 * 60 * 1000,
  
  // Shared settings for all projects
  use: {
    baseURL: getBaseURL(env),
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 30 * 1000,
    actionTimeout: 10 * 1000,
  },

  // Global setup and teardown
  globalSetup: require.resolve('./config/globalSetup.js'),
  globalTeardown: require.resolve('./config/globalTeardown.js'),

  // Project configurations for different browsers
  projects: [
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // Uncomment for mobile testing
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Optional: Retry configuration
  retryOptions: {
    // Retry only on specific errors
    retryIf: async (error) => {
      return error.message.includes('Timeout') || 
             error.message.includes('Connection');
    }
  },

  // Expect timeout
  expect: {
    timeout: 10 * 1000,
  },

  // Web server configuration (uncomment if needed)
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
