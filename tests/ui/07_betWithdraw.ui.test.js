const test = require("../fixtures/login.fixture");
const { expect } = require("@playwright/test");

test.describe("Bet Withdraw test scenario", () => {
    //close 
    async function removeWithdrawRequest(page) {
    await page.getByRole("button", { name: "Cancel" }).click();
    await page.getByRole("button", { name: "Yes" }).click();
  }

  test.beforeEach(async ({ page, login }) => {
    //Login to the system
    await login({ email: "azim@softic.ai", password: "000000" });
    await expect(page.locator('text=Successfully Logged In')).toHaveCount(1, { timeout: 10000 });
    console.log("✅ Successfully Logged In");

    //Wait for a dashboard element after login
    await expect(page.getByRole('button', { name: 'Deposit' })).toBeVisible({ timeout: 10000 });
    console.log("✅ Dashboard loaded");

    //Switch language: Click 'BD' → select 'English'
    const bdBtn = page.getByRole('button', { name: 'BD' });
    await bdBtn.click();
    console.log("🌐 BD dropdown clicked");

    // Wait until the dropdown is open and contains the "English" option
    const englishOption = page.getByText('English', { exact: true });
    // Ensure it's attached and ready
    await expect(englishOption).toBeAttached({ timeout: 5000 });
    await englishOption.scrollIntoViewIfNeeded(); // ensure it's scroll-visible
    await expect(englishOption).toBeVisible({ timeout: 5000 });
    await expect(englishOption).toBeEnabled({ timeout: 5000 });
    // Click reliably (no force)
    await englishOption.click();
    console.log("🌐 Language switched to English");

  });

  test("BetWithdraw BD Wallet", async ({ page }) => {
    // Open profile menu (adjust selector as needed)
    await page.getByTitle('x').getByRole('img').nth(1).click();
    // Go to Bet Accounts
    await page.getByText('Bet Accounts').click();
    // Click Withdraw
    await page.getByRole('button', { name: 'Withdraw' }).click();
    // Choose BD Wallet
    await page.getByText('BD Wallet').click();
    // Enter amount
    const amountInput = page.getByRole('textbox', { name: 'Enter Withdraw Amount' });
    await amountInput.click();
    await amountInput.fill('50');
    // Submit request
    const submitBtn = page.getByRole('button', { name: 'Submit Request' });
    await expect(submitBtn).toBeVisible({ timeout: 10000 });
    await expect(submitBtn).toBeEnabled({ timeout: 10000 });
    await page.waitForTimeout(2000);
    await submitBtn.click();
    console.log("✅ Submit Request clicked");

    // ✅ Assert: Success toast/message appears
    const successToast = page.locator('text=Bet Account Withdraw Successfully Done');
    await expect(successToast).toHaveCount(1, { timeout: 10000 });
    console.log("🎉 Withdraw Success message appeared");

    // Confirm with Yes
     await page.waitForTimeout(2000);
     await removeWithdrawRequest(page);

  });

  test("BetWithdraw Mobile", async ({ page }) => {
  
  //popup/navigation stop
  await expect(page.getByTitle('x').getByRole('img').nth(1)).toBeVisible();
  await page.getByTitle('x').getByRole('img').nth(1).click();
  console.log('✅ Popup closed');

  //Bet Accounts section
  await expect(page.getByText('Bet Accounts')).toBeVisible();
  await page.getByText('Bet Accounts').click();
  console.log('✅ Navigated to Bet Accounts');

  // Withdraw button click
  const withdrawBtn = page.getByRole('button', { name: 'Withdraw' });
  await expect(withdrawBtn).toBeVisible();
  await withdrawBtn.click();
  console.log('✅ Clicked Withdraw button');

  // Nagad Personal select
  const nagadOption = page.getByText('Nagad Personal');
  await expect(nagadOption).toBeVisible();
  await nagadOption.click();
  console.log('✅ Selected Nagad Personal');

  //Amount input
  const amountInput = page.getByRole('textbox', { name: 'Enter amount...' });
  await expect(amountInput).toBeVisible();
  await amountInput.fill('100');
  await expect(amountInput).toHaveValue('100');
  console.log('✅ Entered amount: 100');

  // Submit request
  const submitBtn = page.getByRole('button', { name: 'Submit Request' });
  await expect(submitBtn).toBeVisible();
  await submitBtn.click();
  console.log('✅ Bet Account Withdraw Successfully Done');

  // Withdraw request clear
  await page.waitForTimeout(2000);
  await removeWithdrawRequest(page);
  console.log('✅ withdraw request successfully removed.');

  });

  //bank
  test("BetWithdraw Bank", async ({ page }) => {
  
  const closeBtn = page.getByTitle('x').getByRole('img').nth(1);
  await expect(closeBtn).toBeVisible();
  await closeBtn.click();
  console.log('✅ Popup closed');

  // ২. Bet Accounts 
  const betAccountsBtn = page.getByText('Bet Accounts');
  await expect(betAccountsBtn).toBeVisible();
  await betAccountsBtn.click();
  console.log('✅ Navigated to Bet Accounts');

  // ৩. Withdraw button click
  const withdrawBtn = page.getByRole('button', { name: 'Withdraw' });
  await expect(withdrawBtn).toBeVisible();
  await withdrawBtn.click();
  console.log('✅ Clicked Withdraw');

  // ৪. DBBL Bank অপশন সিলেক্ট করুন
  const dbblOption = page.getByText('DBBL Bank');
  await expect(dbblOption).toBeVisible();
  await dbblOption.click();
  console.log('✅ Selected DBBL Bank');

  // ৫. Amount ইনপুট দিন
  const amountBox = page.getByRole('textbox', { name: 'Enter amount...' });
  await expect(amountBox).toBeVisible();
  await amountBox.fill('20');
  await expect(amountBox).toHaveValue('20');
  console.log('✅ Entered amount: 20');

  // ৬. Submit Request
  const submitBtn = page.getByRole('button', { name: 'Submit Request' });
  await expect(submitBtn).toBeVisible();
  await submitBtn.click();
  console.log('✅ Submitted Request');

  // ৭. Confirm withdrawal modal
  const confirmText = page.getByText('Bet Account Withdraw');
  await expect(confirmText).toBeVisible();
  await confirmText.click();
  console.log('✅ Confirmed Withdraw');

  // ৮. Cancel the request
  const cancelBtn = page.getByRole('button', { name: 'Cancel' });
  await expect(cancelBtn).toBeVisible();
  await cancelBtn.click();
  console.log('✅ Clicked Cancel');

  // ৯. Confirm cancellation
  const yesBtn = page.getByRole('button', { name: 'Yes' });
  await expect(yesBtn).toBeVisible();
  await yesBtn.click();
  console.log('✅ Confirmed Yes on Cancel');

  // 🔟 Final success message
  const successText = page.getByText('withdraw request successfully');
  await expect(successText).toBeVisible();
  console.log('🎉 Withdraw request canceled successfully');


  });

});
