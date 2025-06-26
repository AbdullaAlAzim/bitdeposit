// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * ✅ Production-grade Playwright configuration
 * Supports auto-wait, CI-friendly, element stable interaction,
 * retry logic, and reporting (HTML + Allure).
 */

export default defineConfig({
  // 🔍 Test root folder
  testDir: './tests',

  // 🔁 Run tests in parallel (per worker)
  fullyParallel: true,

  // ❌ Prevent accidental `.only` in CI
  forbidOnly: !!process.env.CI,

  // 🔁 Retry on CI flakiness
  retries: process.env.CI ? 2 : 0,

  // 🧠 Limit worker count in CI
  workers: process.env.CI ? 2 : 4,

  // 📊 Reporters: for local & integration usage
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright']
  ],

  // 🔧 Global behavior settings
  use: {
    baseURL: process.env.BASE_URL || 'https://dev-user.bitdeposit.org',

    // ✅ Action & navigation timeout
    actionTimeout: 15_000,
    navigationTimeout: 30_000,

    // ✅ Element assertion wait (for `expect().toBeVisible()`, etc.)
    expect: {
      timeout: 10_000,
    },

    // 📸 Capture artifacts only when failed
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // 🧪 For flaky test debugging
    trace: 'on-first-retry',

    // 🖥️ Consistent viewport
    viewport: { width: 1280, height: 720 },

    // 🔐 Ignore self-signed HTTPS errors in staging/dev
    ignoreHTTPSErrors: true,

    // 🧪 Required for CI
    headless: true,
  },

  // 🌐 Browsers you want to test on (extendable)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to enable Firefox & Safari
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // 🗂️ Store output artifacts
  outputDir: 'test-results/',

  // Optional: Custom match patterns
  // testMatch: ['**/*.test.js', '**/*.spec.js']
});
