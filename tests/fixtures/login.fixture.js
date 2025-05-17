// tests/fixtures/login.fixture.js

const { test: baseTest, expect } = require('@playwright/test');

const test = baseTest.extend({
  login: async ({ page }, use) => {
    // Define reusable login function
    const login = async ({ email, password }) => {
      await page.goto('https://dev-user.bitdeposit.org/');

      await page.getByRole('button', { name: 'লগইন' }).click();
      await page.getByRole('textbox', { name: 'ইমেইল অথবা অ্যাকাউন্ট আইডি' }).fill(email);
      await page.getByRole('textbox', { name: 'Enter your password' }).fill(password);
      await page.getByRole('dialog').getByRole('button', { name: 'লগইন' }).click();

      await expect(page.locator('text=Successfully Logged In')).toBeVisible({ timeout: 3000 });
    };

    await use(login); // Expose the login function to test
  }
});

module.exports = test;
