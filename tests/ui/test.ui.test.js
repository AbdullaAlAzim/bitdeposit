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

  test("Transfer", async ({ page }) => {
    // ✅ Navigate to Transfer
    await page.getByRole('link', { name: 'Cashout' }).click();
    await page.getByRole('button', { name: 'Transfer' }).nth(1).click();
    await page.getByText('Add Beneficiary').click();
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('rashed@gmail.com');
    await page.getByRole('button', { name: 'Submit' }).click();
    console.log("✅ Beneficiary added: rashed@gmail.com");
    await page.waitForTimeout(2000)

const otpCode = "123456";
const otpSelector = 'input[aria-label^="Please enter OTP character"]';

try {
  // ✅ Confirm OTP modal/text appears first
  await expect(page.locator("text=Enter the OTP")).toBeVisible({ timeout: 10000 }); // adjust to your actual visible text

  // 🖼 Debug before OTP input wait
  await page.screenshot({ path: "before_otp_inputs.png", fullPage: true });

  // ✅ Then wait for OTP inputs
  await page.waitForSelector(otpSelector, { timeout: 20000 });

  const otpInputs = await page.$$(otpSelector);

  if (otpInputs.length !== 6) {
    throw new Error(`❌ Expected 6 OTP inputs, but found ${otpInputs.length}`);
  }

  for (let i = 0; i < otpCode.length; i++) {
    await otpInputs[i].fill(otpCode[i]);
  }

  console.log("✅ OTP filled");
  await page.getByRole("button", { name: "Confirm" }).click();

} catch (error) {
  console.error("❌ OTP error:", error.message);
  if (!page.isClosed()) {
    await page.screenshot({ path: "otp_error.png", fullPage: true });
  }
  throw error;
}


    // ✅ Enter transfer amount
    await page.getByRole("button", { name: "Transfer Now" }).click();
    const amountInput = page.getByRole("textbox", { name: "Enter amount" });
    await amountInput.fill("2");
    console.log("✅ Amount entered: 2 BDT");

    await page.getByRole("button", { name: "Confirm Transfer" }).click();
    await page.getByRole("button", { name: "Confirm Transfer" }).click();
    console.log("✅ Transfer submitted");

    // ✅ Verify success message
    const successMessage = page.locator("h6");
    await expect(successMessage).toHaveText("Your transfer is successful");
    console.log("✅ Transfer success message verified");

    // ✅ Close success modal
    await page
      .locator('//button[@aria-label="Close" and contains(@class, "ant-modal-close")]')
      .click();

    // ✅ Delete the added beneficiary
    await page.getByRole("img", { name: "user", exact: true }).click();
    await page.locator("div").filter({ hasText: /^Beneficiaries$/ }).click();
    await page.getByRole("textbox", { name: "Search" }).fill("850707");
    await page.getByRole("textbox", { name: "Search" }).press("Enter");

    await page
      .locator('div')
      .filter({ hasText: /^Agentsrashed@gmail\.com850707$/ })
      .locator('a')
      .click();

    await page.getByText('Delete').click();
    await page.getByRole('button', { name: 'Delete' }).click();
    console.log("✅ Test beneficiary deleted");
  });
});
