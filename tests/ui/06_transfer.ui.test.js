const test = require("../fixtures/login.fixture");
const { expect } = require("@playwright/test");
//const testEmailUser = require("../../src/utils/testEmailUser.json");

test.describe("Transfer test scenario", () => {
  test.beforeEach(async ({ page, login }) => {
    // Login
    await login({ email: "azim@softic.ai", password: "666666" });
    console.log("Login successful");

    await page.waitForTimeout(6000); // allow UI to settle

    // Change language from Bangla to English
    await page.getByTitle("x").locator("div").click();
    await page
      .locator("div")
      .filter({ hasText: /^সেটিংস$/ })
      .click();
    await page.getByText("Bangla").click();
    await page.getByText("English").click();
    console.log("Language switched to English");

    await page.goto("https://dev-user.bitdeposit.org/profile?tab=settings");
  });

  test("Transfer", async ({ page }) => {
    // Navigate to Transfer section
    await page.getByRole("link", { name: "Transfer", exact: true }).click();
    await page.getByRole("button", { name: "Transfer" }).nth(1).click();
    console.log("Navigated to Transfer page");

    // Add new beneficiary
    await page.getByText("Add Beneficiary").click();
    await page.getByRole("textbox").fill("rashed@softic.ai");
    await page.getByRole("button", { name: "Submit" }).click();
    await page.getByRole("button", { name: "Add as Beneficiary" }).click();
    console.log("Beneficiary added: rashed@softic.ai");

    // OTP input
    const otpCode = "123456";
    await page.waitForSelector(
      'input[aria-label^="Please enter OTP character"]'
    );
    const otpInputs = await page.$$(
      'input[aria-label^="Please enter OTP character"]'
    );
    await expect(otpInputs).toHaveLength(6);

    for (let i = 0; i < otpCode.length; i++) {
      await otpInputs[i].fill(otpCode[i]);
    }
    console.log("OTP filled");

    await page.getByRole("button", { name: "Confirm" }).click();

    // Enter transfer amount
    await page.getByRole("button", { name: "Transfer Now" }).click();
    const amountInput = page.getByRole("textbox", { name: "Enter amount" });
    await amountInput.fill("2");
    console.log("Amount entered 2 BDT");

    await page.getByRole("button", { name: "Confirm Transfer" }).click();
    await page.getByRole("button", { name: "Confirm Transfer" }).click();
    console.log("Transfer submitted");

    // Assertion for success message
    const successMessage = page.locator("h6");
    await expect(successMessage).toHaveText(
      "Your transfer is successful to Rashed Rion"
    );
    console.log("Transfer success message verified");

    // Close modal
    await page
      .locator(
        '//button[@aria-label="Close" and contains(@class, "ant-modal-close")]'
      )
      .click();

    // Delete the added beneficiary
    await page.getByRole("img", { name: "user", exact: true }).click();
    await page
      .locator("div")
      .filter({ hasText: /^Beneficiaries$/ })
      .click();
    await page
      .getByRole("textbox", { name: "Search" })
      .fill("rashed@softic.ai");
    await page.getByRole("textbox", { name: "Search" }).press("Enter");

    await page
      .locator("div")
      .filter({ hasText: /^Usersrashed@softic\.ai616479$/ })
      .locator("a")
      .click();

    await page.getByText("Delete").click();
    await page.getByRole("button", { name: "Delete" }).click();
    console.log("Test beneficiary deleted");
  });
});
