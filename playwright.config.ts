import { defineConfig, devices } from '@playwright/test';
import { CONFIG, ENV_NAME } from './config/env.config';

console.log(`\n🌍 Running tests against environment: ${ENV_NAME.toUpperCase()}\n`);

export default defineConfig({
  testDir: './',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL:    CONFIG.baseUrl,
    trace:      'on-first-retry',
    screenshot: 'only-on-failure',
    video:      'on-first-retry',
    headless:   true,
  },
  projects: [
    // ── UI test projects ───────────────────────────────────────────────────────
    {
      name:    'chromium',
      testDir: './tests',
      use:     { ...devices['Desktop Chrome'] },
    },
    {
      name:    'firefox',
      testDir: './tests',
      use:     { ...devices['Desktop Firefox'] },
    },
    {
      name:    'webkit',
      testDir: './tests',
      use:     { ...devices['Desktop Safari'] },
    },
    {
      name:    'mobile-chrome',
      testDir: './tests',
      use:     { ...devices['Pixel 5'] },
    },

    // ── API test project ───────────────────────────────────────────────────────
    // API tests run headlessly with no browser — just HTTP via Playwright's
    // APIRequestContext. Runs against restful-booker.herokuapp.com directly.
    {
      name:    'api',
      testDir: './api/tests',
      use:     {
        // no browser needed for API tests
        baseURL: 'https://restful-booker.herokuapp.com',
      },
    },
  ],
});
