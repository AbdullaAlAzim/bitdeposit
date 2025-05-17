const test = require("../fixtures/login.fixture");
const { expect } = require("@playwright/test");
const testEmailUser = require("../../src/utils/testEmailUser.json");

for (const user of testEmailUser) {
  test.describe(`Deposit Tests for: ${user.email}`, () => {
    test.beforeEach(async ({ page, login }) => {
      // Login
      await login({ email: user.email, password: user.password });
      console.log("Login successful");
      await page.waitForTimeout(1000);

      // Click Deposit Button
      const depositBtn = page.getByRole("button", { name: "ডিপোজিট করুন" });
      await expect(depositBtn).toBeVisible();
      await depositBtn.click();
      console.log("Clicked 'ডিপোজিট করুন' button");
    });

    test(`Deposit test with mobile bank`, async ({ page }) => {
      const paymentMethod = page.locator("(//div[contains(@class, 'fund-wallet')])[4]");
      await expect(paymentMethod).toBeVisible();
      await paymentMethod.click();
      console.log("Selected 'bKash Personal' payment method");

      const mobileInput = page.getByRole("textbox", { name: "Enter Mobile Number" });
      await expect(mobileInput).toBeVisible();
      await mobileInput.fill("01643234658");
      await expect(mobileInput).toHaveValue("01643234658");
      console.log("Entered and verified mobile number");
      await page.waitForTimeout(1000);

      const amountInput = page.getByRole("textbox", { name: "Enter Deposit Amount" });
      await expect(amountInput).toBeVisible();
      await amountInput.fill("500");
      await expect(amountInput).toHaveValue("500");
      console.log("Entered and verified deposit amount");
      await page.waitForTimeout(1000);

      await page.keyboard.press("Tab");

      const requestBtn = page.getByRole("button", { name: "রিকোয়েস্ট করুন" });
      await expect(requestBtn).toBeVisible();
      await expect(requestBtn).toBeEnabled();
      await requestBtn.click();
      console.log("Clicked 'রিকোয়েস্ট করুন' button");
      await page.waitForTimeout(2000);

      const toast = page.getByText("Deposit request successfully sent");
      await expect(toast).toBeVisible({ timeout: 5000 });
      console.log("Success toast is visible");

      await page.getByRole("button", { name: "বাতিল" }).click();
      await page.getByRole("button", { name: "হ্যাঁ" }).click();

      const depost_remove_msg = page.getByText("Deposit request successfully removed");
      await expect(depost_remove_msg).toBeVisible({ timeout: 5000 });
      console.log("Success toast is visible for deposit removed");
    });

    test(`Deposit test with bank`, async ({ page }) => {
      const paymentMethod = page.locator("(//div[contains(@class, 'fund-wallet')])[11]");
      await expect(paymentMethod).toBeVisible();
      await paymentMethod.click();
      console.log("Selected 'bKash Personal' payment method");
      await page.waitForTimeout(1000);

      // Upload image
      await page.getByRole("button", { name: "envelop" }).click();
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('src/images/image01.jpg');
      console.log("Uploaded file");

      // Fill form fields
      await page.getByRole("textbox", { name: "Account Name..." }).fill("jamal");
      await page.waitForTimeout(1000);
      await page.getByRole("textbox", { name: "Account No..." }).fill("234872386482343");
      await page.waitForTimeout(1000);
      await page.getByRole("textbox", { name: "Enter Deposit Amount" }).fill("567");
      await page.waitForTimeout(1000);

      const requestBtn = page.getByRole("button", { name: "রিকোয়েস্ট করুন" });
      await expect(requestBtn).toBeVisible();
      await requestBtn.click();
      console.log("Clicked 'রিকোয়েস্ট করুন' button");
      await page.waitForTimeout(2000);

      const toast = page.getByText("Deposit request successfully sent");
      await expect(toast).toBeVisible({ timeout: 5000 });
      console.log("Success toast is visible");

      await page.getByRole("button", { name: "বাতিল" }).click();
      await page.getByRole("button", { name: "হ্যাঁ" }).click();

      const depost_remove_msg = page.getByText("Deposit request successfully removed");
      await expect(depost_remove_msg).toBeVisible({ timeout: 5000 });
      console.log("Success toast is visible for deposit removed");
    });
  });
}
