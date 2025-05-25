// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  // Run all tests in parallel
  fullyParallel: true,

  // Fail build on 'test.only' in CI
  forbidOnly: !!process.env.CI,

  // Retry failed tests in CI
  retries: process.env.CI ? 2 : 0,

  // Limit workers in CI
  workers: process.env.CI ? 1 : undefined,

  // ✅ Multiple reporters: HTML and Allure
  reporter: [
    ['html'], // Built-in Playwright HTML report
    ['allure-playwright'], // Extent-style interactive report
  ],

  use: {
    baseURL: 'https://dev-user.bitdeposit.org',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    expect: {
      timeout: 10000,
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  // Projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
