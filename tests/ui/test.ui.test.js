const test = require("../fixtures/login.fixture");
const { expect } = require("@playwright/test");

test.describe("Transfer test scenario", () => {
  test.beforeEach(async ({ page, login }) => {
    // Login
    await login({ email: "azim@softic.ai", password: "666666" });
    console.log("Login successful");

    await page.waitForTimeout(8000); // allow UI to settle

    // Change language from Bangla to English
    await page.getByTitle("x").locator("div").click();
    await page.locator("div").filter({ hasText: /^সেটিংস$/ }).click();
    await page.getByText("Bangla").click();
    await page.getByText("English").click();
    console.log("Language switched to English");

    // Go to settings page to finalize the UI language
    await page.goto("https://dev-user.bitdeposit.org/profile?tab=settings");
  });

  test("Withdraw", async ({ page }) => {
    // Click on Withdraw
    const withdrawLink = page.getByRole("link", { name: "Withdraw" });
    await expect(withdrawLink).toBeVisible({ timeout: 15000 });
    await withdrawLink.click();

    // Wait and click on bKash Pers option
    const bkashOption = page.locator('div:has-text("bKash Pers")').first();
    await expect(bkashOption).toBeVisible({ timeout: 15000 });
    await bkashOption.click();

    // Wait for modal/dialog content to appear
    const modal = page.locator("div[role='dialog'], .modal, .ant-modal-content").first();
    await expect(modal).toBeVisible({ timeout: 15000 });

    // Locate and fill amount input
    const amountInput = modal.getByPlaceholder("Enter amount...");
    await expect(amountInput).toBeVisible({ timeout: 15000 });
    await amountInput.fill("233");

    // Click "Submit Request"
    const submitBtn = page.getByRole("button", { name: "Submit Request" });
    await expect(submitBtn).toBeEnabled({ timeout: 10000 });
    await submitBtn.click();

    // Click "Cancel" to remove the request
    const cancelBtn = page.getByRole("button", { name: "Cancel" });
    await expect(cancelBtn).toBeVisible({ timeout: 10000 });
    await cancelBtn.click();

    // Confirm cancellation
    const yesBtn = page.getByRole("button", { name: "Yes" });
    await expect(yesBtn).toBeVisible({ timeout: 10000 });
    await yesBtn.click();

    // Validate success message
    const successMsg = page.getByText("Request removed successfully");
    await expect(successMsg).toBeVisible({ timeout: 10000 });
  });
});
