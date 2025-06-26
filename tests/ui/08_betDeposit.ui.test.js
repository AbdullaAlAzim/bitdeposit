const test = require("../fixtures/login.fixture");
const { expect } = require("@playwright/test");
const testEmailUser = require("../../src/utils/testEmailUser.json");
const db = require("../../src/utils/db");
const fs = require("fs");

// 📁 Create screenshots folder if not exists
if (!fs.existsSync("screenshots")) {
  fs.mkdirSync("screenshots");
}

for (const user of testEmailUser) {
  test.describe(`Deposit Tests for: ${user.email}`, () => {
    test.beforeEach(async ({ page, login }) => {
      await login({ email: user.email, password: user.password });
      console.log("✅ Login successful");
      await page.waitForTimeout(1000);

      const depositBtn = page.getByRole("button", { name: "ডিপোজিট করুন" });
      await expect(depositBtn).toBeVisible();
      await depositBtn.click();
      console.log("✅ Clicked 'ডিপোজিট করুন' button");
    });

    test(`Bet Deposit test `, async ({ page }) => {

``
    });

  });
}
