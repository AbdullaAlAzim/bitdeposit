const test = require("../fixtures/login.fixture");
const { expect } = require("@playwright/test");

test.describe(`Withdraw By Mobile & Bank`, () => {
  test.beforeEach(async ({ page, login }) => {
    // 🔐 Login
    await login({ email: "azim@softic.ai", password: "666666" });
    console.log("✅ Login successful");

    await page.waitForTimeout(1000);

    // 🌐 Switch language Bangla → English
    await page.getByTitle("x").locator("div").click();
    await page.locator("div").filter({ hasText: /^সেটিংস$/ }).click();
    await page.getByText("Bangla").click();
    await page.getByText("English").click();

    // Navigate to settings to confirm language change
    await page.goto("https://dev-user.bitdeposit.org/profile?tab=settings");
  });

  test("Withdraw By Mobile", async ({ page }) => {
    test.setTimeout(60000);

    try {
      // Step 1: Navigate to Withdraw page
      await page.locator('//a[@href="/withdraw" and .//span[text()="Withdraw"]]').click();
      await page.waitForURL('**/withdraw', { waitUntil: 'networkidle', timeout: 15000 });

      // Step 2: Select bKash Personal
      await page.getByText('bKash Personal', { exact: true }).click();
      await page.waitForLoadState('networkidle', { timeout: 10000 });

      // Step 3: Input amount
      const amountInput = page.locator('input.ant-input[placeholder="Enter amount..."]');
      await amountInput.waitFor({ state: 'visible', timeout: 15000 });
      await amountInput.evaluate(el => el.value = '');
      await amountInput.evaluate(el => el.focus());
      await page.keyboard.type('1000');

      // Step 4: Submit request
      const submitBtn = page.locator('//button[.//small[text()="Submit Request"]]');
      await submitBtn.waitFor({ state: 'visible', timeout: 10000 });
      await submitBtn.click({ force: true });
      await page.waitForTimeout(1000);

      // Step 5: Click Cancel in modal
      const cancelBtn = page.locator('//button[.//small[text()="Cancel"]]');
      await cancelBtn.waitFor({ state: 'visible', timeout: 10000 });
      await cancelBtn.click({ force: true });
      await page.waitForTimeout(1000);

      // Step 6: Confirm "Yes"
      const confirmBtn = page.locator('//button[.//span[contains(text(), "Yes")]]');
      if ((await confirmBtn.count()) === 0) {
        throw new Error("❌ 'Yes' button not found after Cancel");
      }

      await confirmBtn.first().click({ force: true });
      await page.waitForTimeout(1000);

      // Step 7: Verify success
      const successMessage = page.getByText('Request removed successfully', { exact: true });
      await successMessage.waitFor({ state: 'visible', timeout: 15000 });
      await expect(successMessage).toBeVisible();

      console.log("✅ Mobile Withdraw test passed");

    } catch (error) {
      console.error('❌ Mobile Withdraw Test failed:', error);
      throw error;
    }
  });

  test("Withdraw By Bank", async ({ page }) => {
    test.setTimeout(90000);

    try {
      // Step 1: Go to Withdraw page
      await page.locator('//a[@href="/withdraw" and .//span[text()="Withdraw"]]').click();
      await page.waitForURL('**/withdraw', { waitUntil: 'domcontentloaded', timeout: 15000 });

      // Step 2: Select Bank option
      await page.waitForTimeout(3000);
      const bankOption = page.getByText(/Bank/i, { exact: false }).first();
      await bankOption.waitFor({ state: 'visible', timeout: 10000 });
      await bankOption.click();
      await page.waitForLoadState('networkidle', { timeout: 15000 });

      // Step 3: Input amount
      const amountInput = page.locator('input.ant-input[placeholder="Enter amount..."]');
      await amountInput.waitFor({ state: 'visible', timeout: 15000 });
      await amountInput.fill('');
      await amountInput.focus();
      await page.keyboard.type('2000');

      // Step 4: Submit request
      const submitBtn = page.locator('//button[.//small[text()="Submit Request"]]');
      await submitBtn.waitFor({ state: 'visible', timeout: 10000 });
      await submitBtn.click({ force: true });
      await page.waitForTimeout(1000);

      // Step 5: Cancel in modal
      const cancelBtn = page.locator('//button[.//small[text()="Cancel"]]');
      await cancelBtn.waitFor({ state: 'visible', timeout: 10000 });
      await cancelBtn.click({ force: true });
      await page.waitForTimeout(1000);

      // Step 6: Confirm cancellation
      const confirmBtn = page.locator('//button[.//span[contains(text(), "Yes")]]');
      if ((await confirmBtn.count()) === 0) {
        throw new Error("❌ 'Yes' button not found after Cancel");
      }

      await confirmBtn.first().click({ force: true });
      await page.waitForTimeout(1000);

      // Step 7: Verify success
      const successMessage = page.getByText('Request removed successfully', { exact: true });
      await successMessage.waitFor({ state: 'visible', timeout: 15000 });
      await expect(successMessage).toBeVisible();

      console.log("✅ Bank Withdraw test passed");

    } catch (error) {
      console.error('❌ Bank Withdraw Test failed:', error);
      throw error;
    }
  });
});
