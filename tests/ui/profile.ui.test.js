const test = require("../fixtures/login.fixture");
const { expect } = require("@playwright/test");
const testEmailUser = require("../../src/utils/testEmailUser.json");

for (const user of testEmailUser) {
  test.describe(`Profile Tests for: ${user.email}`, () => {
    test.beforeEach(async ({ page, login }) => {
      // Login
      await login({ email: user.email, password: user.password });
      console.log("Login successful");
      await page.waitForTimeout(1000);
      await page.getByTitle("x").locator("div").click();
      await page.getByRole("button", { name: "ব্যক্তিগত প্রোফাইল" }).click();
    });

    test("Profile Email add test", async ({ page }) => {
      const randomEmail = `rashed${Math.floor(
        Math.random() * 10000
      )}@softic.ai`;

      await page.getByRole("paragraph").filter({ hasText: "Edit" }).click();
      await page.getByRole("button", { name: "হ্যাঁ" }).click();
      await page.waitForTimeout(5000);

      const otpCode = "123456";
      await page.waitForSelector('input[type="password"]', {
        state: "visible",
      });
      const otpInputs = await page.$$('input[type="password"]');
      await expect(otpInputs).toHaveLength(6);
      for (let i = 0; i < otpCode.length; i++) {
        await otpInputs[i].fill(otpCode[i]);
      }

      await page.getByRole("button", { name: "নিশ্চিত করুন" }).click();

      //Email add/changed
      await page.getByRole("textbox", { name: "Enter your email..." }).click();
      await page
        .getByRole("textbox", { name: "Enter your email..." })
        .fill(randomEmail);
      await page.getByRole("button", { name: "Verify" }).click();

      const otpCode2 = "123456";
      await page.waitForSelector('input[type="password"]', {
        state: "visible",
      });
      const otpInputs2 = await page.$$('input[type="password"]');
      await expect(otpInputs2).toHaveLength(6);
      for (let i = 0; i < otpCode2.length; i++) {
        await otpInputs2[i].fill(otpCode2[i]);
      }

      await page.getByRole("button", { name: "নিশ্চিত করুন" }).click();
      await page
        .getByRole("heading", { name: "Your email has been Updated" })
        .click();
      await page.waitForTimeout(2000);
      await page.getByRole("button", { name: "Close" }).nth(0).click();
    });

    test("Profile phone number add test", async ({ page }) => {
      const randomPhone =
        "019" + Math.floor(10000000 + Math.random() * 90000000).toString();

      // Phone number add
      await page.getByText("Add").click();
      await page.getByRole("textbox", { name: "Enter number..." }).click();
      await page
        .getByRole("textbox", { name: "Enter number..." })
        .fill(randomPhone);
      await page.getByRole("button", { name: "Verify" }).click();

      const otpCode3 = "123456";
      await page.waitForSelector('input[type="password"]', {
        state: "visible",
      });
      const otpInputs3 = await page.$$('input[type="password"]');
      await expect(otpInputs3).toHaveLength(6);
      for (let i = 0; i < otpCode3.length; i++) {
        await otpInputs3[i].fill(otpCode3[i]);
      }
      await page.getByRole("button", { name: "নিশ্চিত করুন" }).click();

      await page
        .getByRole("heading", {
          name: "আপনার মোবাইল নাম্বার ভেরিফিকেশন সফল হয়েছে। কিছুক্ষণের ভেতর আমাদের একজন প্রতিনিধ",
        })
        .click();
      await page.getByRole("button", { name: "Close" }).nth(1).click();
    });

    //Name add
    test("Profile Name add test", async ({ page }) => {
      await page.locator("span").filter({ hasText: "Edit" }).click();
      await page.getByRole("textbox", { name: "First Name" }).click();
      await page.getByRole("textbox", { name: "First Name" }).fill("rashed");
      await page.getByRole("textbox", { name: "Last Name" }).click();
      await page.getByRole("textbox", { name: "Last Name" }).fill("rio");
      await page.getByRole("button", { name: "Save" }).click();
      await page.locator("b").filter({ hasText: "rashed rio" }).click();
    });

   test('Profile Identity verify test', async ({ page }) => {
  // Step 1: Open Identity Verification
  await page.getByRole('button', { name: 'এখন যাচাই করুন' }).click();
  await page.getByText('Verify Identity').click();

  // Step 2: Fill Date of Birth
  await page.getByRole('textbox', { name: 'Select date' }).click();
  await page.getByRole('textbox', { name: 'Select date' }).press('ArrowLeft');
  await page.getByRole('textbox', { name: 'Select date' }).fill('2005/05/18');
  await page.getByText('Date of Birth *').click();

  // Step 3: Fill NID Number
  await page.getByRole('textbox', { name: 'Nid number' }).click();
  await page.getByRole('textbox', { name: 'Nid number' }).fill('36456356560007');

  await page.waitForTimeout(1000);

  // Step 4: Upload Front Image
  await page
    .getByLabel('Verify Identity')
    .locator('form div')
    .filter({
      hasText:
        'Front image * একটি ফাইল আপলোড করুন বা টেনে আনুনPNG, JPG, JPEG upto 1MB',
    })
    .locator('input[type="file"]')
    .setInputFiles('src/images/image01.jpg');

  console.log('✅ Front image uploaded');
  await page.waitForTimeout(1000);

  // Step 5: Upload Back Image
  await page
    .getByLabel('Verify Identity')
    .locator('form div')
    .filter({
      hasText:
        'Back image * একটি ফাইল আপলোড করুন বা টেনে আনুনPNG, JPG, JPEG upto 1MB',
    })
    .locator('input[type="file"]')
    .setInputFiles('src/images/image02.jpg');

  console.log('✅ Back image uploaded');
  await page.waitForTimeout(1000);

  // Step 6: Submit verification
  await page.getByRole('button', { name: 'Request to verify' }).click();
  console.log('📝 Clicked: Request to verify');

   await page.waitForTimeout(1000);
  // Step 7: Assert confirmation text
// Step 7: Assert confirmation text inside modal
const modal = page.getByRole('dialog'); // বা .locator('.ant-modal') if that's used
await expect(
  modal.getByText('Verification request sent!!', { exact: true })
).toBeVisible();
console.log('✅ Confirmation text visible inside modal');

  // Step 8: Close modal/dialog
 await expect(modal.getByRole('button', { name: 'Close' })).toBeVisible();
 await modal.getByRole('button', { name: 'Close' }).click();

});
  });
}
