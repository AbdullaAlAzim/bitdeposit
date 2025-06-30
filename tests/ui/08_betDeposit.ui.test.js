const test = require("../fixtures/login.fixture");
const { expect } = require("@playwright/test");

const fixedUser = {
  email: "azim@softic.ai",
  password: "666666"
};

test.beforeEach(async ({ page, login }) => {
  // Login
  await login({ email: fixedUser.email, password: fixedUser.password });
  console.log("Login successful");

  await page.waitForTimeout(6000); // allow UI to settle

  // Change language from Bangla to English
  await page.getByTitle("x").locator("div").click();
  await page.locator("div").filter({ hasText: /^সেটিংস$/ }).click();
  await page.getByText("Bangla").click();
  await page.getByText("English").click();
  console.log("Language switched to English");

  await page.goto("https://dev-user.bitdeposit.org/profile?tab=settings");
});

test('Bet Transfer লিঙ্ক কাজ করছে কিনা', async ({ page }) => {
  test.setTimeout(60000); // timeout বাড়ানো

  // Step 1: Go to Bet Transfer page
  await page.getByRole('link', { name: 'Bet Transfer', exact: true }).click();

  // Step 2: Click second Deposit button
  const depositBtn = page.getByRole('button', { name: 'Deposit' }).nth(1);
  await expect(depositBtn).toBeVisible();
  await depositBtn.click();

  // Step 3: Select BD Wallet
  await page.getByText('BD Wallet').click();

  // Step 4: Fill deposit amount
  const amountBox = page.getByRole('textbox', { name: 'Enter Deposit Amount' });
  await expect(amountBox).toBeVisible();
  await amountBox.fill('100');

  // Step 5: Submit and cancel
  await page.getByRole('button', { name: 'Submit Request' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();

  // Step 6: Confirm by clicking 'Yes' on modal
  // ✅ Wait for modal manually using selector
  await page.waitForSelector('button:has-text("Yes")', { timeout: 10000 });

  const yesBtn = page.getByRole('button', { name: 'Yes' });

  await Promise.all([
    page.waitForLoadState('networkidle'),
    yesBtn.click({ force: true })
  ]);

  console.log("✅ Deposit cancellation confirmed.");
});

