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

  // Use HTML reporter
  reporter: 'html',

  use: {
    // 💡 Base URL — use relative page.goto('/login') etc.
    baseURL: 'https://dev-user.bitdeposit.org',

    // 💡 Global action timeout (click, fill, etc.)
    actionTimeout: 15000, // 15 seconds

    // 💡 Navigation timeout
    navigationTimeout: 30000, // 30 seconds

    // 💡 Expect timeout for expect() conditions
    expect: {
      timeout: 10000, // 10 seconds
    },

    // Automatically capture screenshot on failure
    screenshot: 'only-on-failure',

    // Optional: Record video on retry
    video: 'retain-on-failure',

    // Record trace on first retry
    trace: 'on-first-retry',
  },

  // Projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Optionally add:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
