const test = require("../fixtures/login.fixture");
const { expect } = require("@playwright/test");

test.describe("Transfer test scenario", () => {
  // ✅ Increase the timeout for the whole test suite
  test.setTimeout(90000);

  test.beforeEach(async ({ page, login }) => {
    // ✅ Login
    await login({ email: "azim@softic.ai", password: "666666" });
    console.log("✅ Login successful");

    await page.waitForTimeout(6000); // let UI settle

    // ✅ Switch Language Bangla → English
    await page.getByTitle("x").locator("div").click();
    await page.locator("div").filter({ hasText: /^সেটিংস$/ }).click();
    await page.getByText("Bangla").click();
    await page.getByText("English").click();
    console.log("✅ Language switched to English");

    await page.goto("https://dev-user.bitdeposit.org/profile?tab=settings");
  });

  test("BetWithdraw Test", async ({ page }) => {
    
  });
});
