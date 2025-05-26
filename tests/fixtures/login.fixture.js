// fixtures/login.fixture.js
const { test: baseTest, expect } = require("@playwright/test");

const test = baseTest.extend({
  login: async ({ page }, use) => {
    const login = async ({ email, password }) => {
      page.setDefaultTimeout(60000);
      await page.goto("https://dev-user.bitdeposit.org/");
     // await page.waitForLoadState('networkidle');

      await page.getByRole("button", { name: "লগইন" }).click();
      await page.getByRole("textbox", { name: "ইমেইল অথবা অ্যাকাউন্ট আইডি" }).fill(email);
      await page.getByRole("textbox", { name: "Enter your password" }).fill(password);

      await page.getByRole("dialog").getByRole("button", { name: "লগইন" }).click();

      // Wait for login success indicator (toast or page element)
      await expect(page.locator("text=Successfully Logged In")).toBeVisible({ timeout: 5000 });

      // Also confirm user redirected to dashboard/home
      //await page.waitForLoadState('networkidle');
    };

    await use(login);
  },
});

module.exports = test;
