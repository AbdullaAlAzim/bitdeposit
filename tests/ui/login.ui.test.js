import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// ✅ Correctly resolve file paths
const testEmailUserPath = path.join(__dirname, '../../src/utils/testEmailUser.json');
const testMobileUserPath = path.join(__dirname, '../../src/utils/testMobileUser.json');

// ✅ Parse user data from JSON array (first user)
const emailUser = JSON.parse(fs.readFileSync(testEmailUserPath, 'utf-8'))[0];
const mobileUser = JSON.parse(fs.readFileSync(testMobileUserPath, 'utf-8'))[0];

test.describe(':closed_lock_with_key: User Login Scenarios', () => {

  // ✅ Run before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('https://dev-user.bitdeposit.org/');
  });

  // ✅ Email Login Test
  test(':e-mail: Login with Email', async ({ page }) => {
    await page.getByRole('button', { name: 'লগইন' }).click();

    await page.getByRole('textbox', { name: 'ইমেইল অথবা অ্যাকাউন্ট আইডি' }).fill(emailUser.email);
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(emailUser.password);

    await page.getByRole('dialog').getByRole('button', { name: 'লগইন' }).click();

    try {
      await expect(page.locator('text=Successfully Logged In')).toBeVisible({ timeout: 3000 });
      console.log('✅ Test Passed: Successfully Logged In with Email');
    } catch (error) {
      console.error('❌ Test Failed: Email login toast not found');
      throw error;
    }
  });

  // ✅ Mobile Login Test
  test(':iphone: Login with Phone Number', async ({ page }) => {
    await page.getByRole('button', { name: 'লগইন' }).click();

    // Switch to mobile login (depending on UI selector)
    await page
      .locator('form')
      .filter({ hasText: 'ইমেইল অথবা অ্যাকাউন্ট আইডি' })
      .getByRole('img')
      .nth(2)
      .click();

    await page.getByPlaceholder('Your number').fill(mobileUser.mobile);
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(mobileUser.password);

    await page.getByRole('dialog').getByRole('button', { name: 'লগইন' }).click();

    try {
      await expect(page.locator('text=Successfully Logged In')).toBeVisible({ timeout: 3000 });
      console.log('✅ Test Passed: Successfully Logged In with Phone');
    } catch (error) {
      console.error('❌ Test Failed: Phone login toast not found');
      throw error;
    }
  });

});
