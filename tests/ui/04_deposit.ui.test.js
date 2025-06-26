const test = require("../fixtures/login.fixture");
const { expect } = require("@playwright/test");
const testEmailUser = require("../../src/utils/testEmailUser.json");
const db = require("../../src/utils/db");
const fs = require("fs");

// 📁 Create screenshots folder if not exists
if (!fs.existsSync("screenshots")) {
  fs.mkdirSync("screenshots");
}

// ✅ Only using the first test user (you can extend this)
const user = testEmailUser[0];

//test.describe.configure({ mode: 'serial' }); // Run deposit tests in order
test.describe(`Deposit Tests`, () => {

  test.beforeEach(async ({ page, login }) => {
    await login({ email: user.email, password: user.password });
    console.log("✅ Login successful");
    console.log("✅ Logged in as:", user.email);

    await page.waitForTimeout(1000);
    const depositBtn = page.getByRole("button", { name: "ডিপোজিট করুন" });
    await expect(depositBtn).toBeVisible();
    await depositBtn.click();
    console.log("✅ Clicked 'ডিপোজিট করুন' button");
  });

  test(`Deposit test with mobile @regression`, async ({ page }) => {
    const paymentMethod = page.locator("(//div[contains(@class, 'fund-wallet')])[4]");
    await expect(paymentMethod).toBeVisible();
    await paymentMethod.click();
    console.log("✅ Selected Mobile Bank method");

    const mobileNumber = "01643234658";
    const depositAmount = 500;

    await page.getByRole("textbox", { name: "Enter Mobile Number" }).fill(mobileNumber);
    await page.getByRole("textbox", { name: "Enter Deposit Amount" }).fill(depositAmount.toString());
    await page.keyboard.press("Tab");

    const requestBtn = page.getByRole("button", { name: "রিকোয়েস্ট করুন" });
    await expect(requestBtn).toBeVisible();
    await expect(requestBtn).toBeEnabled();

    page.on("response", (res) => {
      if (res.request().method() === "POST") {
        console.log("📡 POST:", res.status(), res.url());
      }
    });

    await requestBtn.click();
    console.log("🔄 Request button clicked");

    const toast = page.getByText("Deposit request successfully sent.");
    await expect(toast).toBeVisible({ timeout: 7000 });
    console.log("✅ Toast is visible");

    await page.getByRole("button", { name: "বাতিল" }).click();
    await page.getByRole("button", { name: "হ্যাঁ" }).click();

    const depostRemoveMsg = page.getByText("Deposit request successfully removed");
    await expect(depostRemoveMsg).toBeVisible({ timeout: 5000 });
    console.log("✅ Deposit removed");

    const dbRecord = await db.findLatestMobileBankDepositFullInfo(mobileNumber);
    expect(dbRecord).toBeDefined();
    expect(dbRecord.amount).toBe(depositAmount);
    expect(dbRecord.mobile_number).toBe(mobileNumber);
    expect(dbRecord.status).toMatch(/pending|approved|rejected|removed/);

    if (dbRecord.status !== "removed") {
      expect(dbRecord.trx_no).not.toBeNull();
      expect(dbRecord.transaction_id).not.toBeNull();
    } else {
      console.warn("⚠️ Deposit was removed — skipping trx_no & transaction_id check.");
    }

    expect(dbRecord.user_id).not.toBeNull();
    console.log("✅ DB record verified:", dbRecord);
  });

test(`Deposit test with bank @regression`, async ({ page }) => {
      const paymentMethod = page.locator(
        "(//div[contains(@class, 'fund-wallet')])[11]"
      );
      await expect(paymentMethod).toBeVisible();
      await paymentMethod.click();
      console.log("✅ Selected 'Bank' deposit method");

      await page.waitForTimeout(1000);

      await page.getByRole("button", { name: "envelop" }).click();
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles("src/images/image01.jpg");
      console.log("✅ File uploaded");

      await page
        .getByRole("textbox", { name: "Account Name..." })
        .fill("jamal");
      await page.waitForTimeout(500);
      await page
        .getByRole("textbox", { name: "Account No..." })
        .fill("234872386482343");
      await page.waitForTimeout(500);
      await page
        .getByRole("textbox", { name: "Enter Deposit Amount" })
        .fill("567");
      await page.waitForTimeout(500);

      const requestBtn = page.getByRole("button", { name: "রিকোয়েস্ট করুন" });
      await expect(requestBtn).toBeVisible();
      await expect(requestBtn).toBeEnabled();

      // 🔍 Log all API responses
      page.on("response", (res) => {
        console.log("📡 Response:", res.status(), res.url());
      });

      await requestBtn.click();
      console.log("🔄 Request button clicked");

      const toast = page.getByText("Deposit request successfully sent");
      await expect(toast).toBeVisible({ timeout: 7000 });
      console.log("✅ Success toast is visible");

      // await page.screenshot({
      //   path: `screenshots/${user.email}_bank_deposit.png`,
      //   fullPage: true,
      // });
      console.log("📸 Screenshot saved (Bank)");

      await page.getByRole("button", { name: "বাতিল" }).click();
      await page.getByRole("button", { name: "হ্যাঁ" }).click();

      const depostRemoveMsg = page.getByText(
        "Deposit request successfully removed"
      );
      await expect(depostRemoveMsg).toBeVisible({ timeout: 5000 });
      console.log("✅ Deposit removed (Bank)");
    });
});
