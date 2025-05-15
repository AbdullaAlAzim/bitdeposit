// @ts-check
import { defineConfig, devices } from '@playwright/test'
/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // :hourglass_flowing_sand: Action wait timeout (e.g., click, fill, etc.)
    actionTimeout: 10000, // 10 seconds
    // :globe_with_meridians: Page navigation timeout (e.g., page.goto)
    navigationTimeout: 30000, // 30 seconds
    // :white_check_mark: Expectation timeout (e.g., expect(locator).toBeVisible())
    expect: {
      timeout: 8000, // 8 seconds
    },
    // Optional: Base URL if you use relative paths
    // baseURL: 'https://dev-user.bitdeposit.org',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Add other browsers if needed
  ],
});