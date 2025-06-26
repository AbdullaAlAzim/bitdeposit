const test = require("../fixtures/login.fixture");
const { expect } = require("@playwright/test");

test.describe(`Withdraw By Mobile`, () => {
  test.beforeEach(async ({ page, login }) => {
    // Login
    await login({ email: "azim@softic.ai", password: "666666" });
    console.log("Login successful");

    await page.waitForTimeout(1000);

    // Switch language Bangla → English
    await page.getByTitle("x").locator("div").click();
    await page.locator("div").filter({ hasText: /^সেটিংস$/ }).click();
    await page.getByText("Bangla").click();
    await page.getByText("English").click();

    // Ensure English language loaded
    await page.goto("https://dev-user.bitdeposit.org/profile?tab=settings");
  });

  test("Withdraw By Mobile", async ({ page }) => {
    test.setTimeout(60000); // Increase timeout

    try {
      // Step 1: Navigate to Withdraw
      await page.locator('//a[@href="/withdraw" and .//span[text()="Withdraw"]]').click();
      await page.waitForURL('**/withdraw', { waitUntil: 'networkidle', timeout: 15000 });

      // Step 2: Select bKash Personal
      await page.getByText('bKash Personal', { exact: true }).click();
      await page.waitForLoadState('networkidle', { timeout: 10000 });

      // Step 3: Fill amount
      const amountInput = page.locator('input.ant-input[placeholder="Enter amount..."]');
      await amountInput.waitFor({ state: 'visible', timeout: 15000 });
      await amountInput.evaluate(el => el.value = '');
      await amountInput.evaluate(el => el.focus());
      await page.keyboard.type('1000');

      // Step 4: Submit Request
      const submitBtn = page.locator('//button[.//small[text()="Submit Request"]]');
      await submitBtn.waitFor({ state: 'visible', timeout: 10000 });
      await submitBtn.click({ force: true });
      await page.waitForTimeout(1000);

      // Step 5: Click Cancel in confirmation modal
      const cancelBtn = page.locator('//button[.//small[text()="Cancel"]]');
      await cancelBtn.waitFor({ state: 'visible', timeout: 10000 });
      await cancelBtn.click({ force: true });
      await page.waitForTimeout(1000);

      // Step 6: Confirm Yes (with fallback logic)
      await page.waitForTimeout(1000); // Give modal time to appear
      const confirmBtn = page.locator('//button[.//span[contains(text(), "Yes")]]');
      const confirmCount = await confirmBtn.count();

      if (confirmCount === 0) {
        console.warn("⚠️ 'Yes' button not found. Dumping all button texts for debug:");
        const allBtns = await page.locator('button').all();
        for (const [i, btn] of allBtns.entries()) {
          const text = await btn.innerText();
          console.log(`Button ${i}: ${text}`);
        }
        throw new Error("❌ 'Yes' button not found after Cancel");
      }

      await confirmBtn.first().click({ force: true });
      await page.waitForTimeout(1000);

      // Step 7: Verify success message
      const successMessage = page.getByText('Request removed successfully', { exact: true });
      await successMessage.waitFor({ state: 'visible', timeout: 15000 });
      await expect(successMessage).toBeVisible();
      await page.waitForLoadState('networkidle', { timeout: 5000 });

    } catch (error) {
      console.error('❌ Test failed:', error);
      throw error;
    }
  });
});
