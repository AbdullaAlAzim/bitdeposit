const test = require('../fixtures/login.fixture');
const { expect } = require('@playwright/test');
const testEmailUser = require('../../src/utils/testEmailUser.json');

test.describe('Deposit Tests with Login Fixture', () => {
  for (const user of testEmailUser) {
    test(`Deposit test for user: ${user.email}`, async ({ page, login }) => {
      console.log(`Starting deposit test for: ${user.email}`);

      // Login
      await login({ email: user.email, password: user.password });
      console.log("Login successful");

      // Click Deposit Button
      const depositBtn = page.getByRole('button', { name: 'ডিপোজিট করুন' });
      await expect(depositBtn).toBeVisible({ timeout: 3000 });
      await depositBtn.click();
      console.log("Clicked 'ডিপোজিট করুন' button");

      // Select bKash Personal
      const bkashOption = page.locator('div').filter({ hasText: /^bKash Personal$/ });
      await expect(bkashOption).toBeVisible({ timeout: 3000 });
      await bkashOption.click();
      console.log("Selected 'bKash Personal'");

      // Fill Mobile Number
      const mobileInput = page.getByRole('textbox', { name: 'Enter Mobile Number' });
      await expect(mobileInput).toBeVisible({ timeout: 3000 });
      await mobileInput.fill('01643234658');
      console.log("Entered mobile number");

      // Fill Deposit Amount
      const amountInput = page.getByRole('textbox', { name: 'Enter Deposit Amount' });
      await expect(amountInput).toBeVisible({ timeout: 3000 });
      await amountInput.fill('500');
      console.log("Entered deposit amount");

      // Click Request Button
      const requestBtn = page.getByRole('button', { name: 'রিকোয়েস্ট করুন' });
      await expect(requestBtn).toBeVisible({ timeout: 3000 });
      await requestBtn.click();
      console.log("Clicked 'রিকোয়েস্ট করুন' button");

      // Optional: Assert deposit success toast (uncomment if needed)
      // const successToast = page.locator('text=Deposit Successful');
      // await expect(successToast).toBeVisible({ timeout: 5000 });
      // console.log("Deposit success confirmed");

      console.log(`Deposit flow completed for user: ${user.email}`);
    });
  }
});
