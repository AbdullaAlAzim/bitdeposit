const test = require("../fixtures/login.fixture");
const { expect } = require("@playwright/test");
import path from 'path'; 

test.describe("Bet Deposit test scenario", () => {
    //close 
//      async function removeDepositRequest(page) {
//      await page.getByRole("button", { name: "Cancel" }).click();
//      await page.getByRole("button", { name: "Yes" }).click();
//    }

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

  test("BetDepsoit BD Wallet", async ({ page }) => {

  //  Popup stop
  const closePopupBtn = page.getByTitle('x').getByRole('img').nth(1);
  await expect(closePopupBtn).toBeVisible();
  await closePopupBtn.click();
  console.log('✅ Closed popup');

  //  Bet Accounts click
  const betAccounts = page.getByText('Bet Accounts');
  await expect(betAccounts).toBeVisible();
  await betAccounts.click();
  console.log('✅ Navigated to Bet Accounts');

  // Deposit 
  const depositBtn = page.getByRole('main').getByRole('button', { name: 'Deposit' });
  await expect(depositBtn).toBeVisible();
  await depositBtn.click();
  console.log('✅ Clicked Deposit');

  //  BD Wallet select
  const bdWalletOption = page.getByText('BD Wallet');
  await expect(bdWalletOption).toBeVisible();
  await bdWalletOption.click();
  console.log('✅ Selected BD Wallet');

  // Amount input
  const amountInput = page.getByRole('textbox', { name: 'Enter Deposit Amount' });
  await expect(amountInput).toBeVisible();
  await amountInput.fill('111');
  await expect(amountInput).toHaveValue('111');
  console.log('✅ Filled deposit amount');

  // Submit request
  const submitBtn = page.getByRole('button', { name: 'Submit Request' });
  await expect(submitBtn).toBeVisible();
  await submitBtn.click();
  console.log('✅ Submitted deposit request');

  // Cancel the deposit
  const cancelBtn = page.getByRole('button', { name: 'Cancel' });
  await expect(cancelBtn).toBeVisible();
  await cancelBtn.click();
  console.log('✅ Clicked Cancel');

  });


 test("BetDepsoit Mobile", async ({ page }) => {

  // ১. Popup বন্ধ
  const closePopupBtn = page.getByTitle('x').getByRole('img').nth(1);
  await expect(closePopupBtn).toBeVisible();
  await closePopupBtn.click();
  console.log('✅ Closed popup');

  // ২. Bet Accounts এ যান
  const betAccounts = page.getByText('Bet Accounts');
  await expect(betAccounts).toBeVisible();
  await betAccounts.click();
  console.log('✅ Navigated to Bet Accounts');

  // ৩. Deposit বাটনে ক্লিক
  const depositBtn = page.getByRole('main').getByRole('button', { name: 'Deposit' });
  await expect(depositBtn).toBeVisible();
  await depositBtn.click();
  console.log('✅ Clicked Deposit');

  // ৪. Rocket Personal অপশন
  const rocketOption = page.getByText('Rocket Personal');
  await expect(rocketOption).toBeVisible();
  await rocketOption.click();
  console.log('✅ Selected Rocket Personal');

  // ৫. Mobile নম্বর ইনপুট
  const mobileInput = page.getByRole('textbox', { name: 'Enter Mobile Number' });
  await expect(mobileInput).toBeVisible();
  await mobileInput.fill('01914588787');
  await expect(mobileInput).toHaveValue('01914588787');
  console.log('✅ Entered mobile number');

  // ৬. Amount ইনপুট
  const amountInput = page.getByRole('textbox', { name: 'Enter Deposit Amount' });
  await expect(amountInput).toBeVisible();
  await amountInput.fill('20');
  await expect(amountInput).toHaveValue('20');
  console.log('✅ Entered deposit amount');

  // ৭. Submit request
  const submitBtn = page.getByRole('button', { name: 'Submit Request' });
  await expect(submitBtn).toBeVisible();
  await submitBtn.click();
  console.log('✅ Submitted deposit request');

  // ৮. Confirm deposit
  await page.waitForSelector('text=Bet Account Deposit', { timeout: 10000 });
  const confirmDeposit = page.getByText('Bet Account Deposit');
  await expect(confirmDeposit).toBeVisible({ timeout: 10000 });
  await confirmDeposit.click();
  console.log('✅ Confirmed Bet Account Deposit');

  // ৯. Cancel request
  const cancelBtn = page.getByRole('button', { name: 'Cancel' });
  await expect(cancelBtn).toBeVisible();
  await cancelBtn.click();
  console.log('✅ Clicked Cancel');

  const yesBtn = page.getByRole('button', { name: 'Yes' });
  await expect(yesBtn).toBeVisible();
  await yesBtn.click();
  console.log('✅ Confirmed Cancel');

  // 🔟 Success message
  const successMsg = page.getByText('deposit request successfully');
  await expect(successMsg).toBeVisible({ timeout: 10000 });
  console.log('🎉Deposit request cancelled successfully');
    

 });


 // bank

 test("BetDepsoit Bank", async ({ page }) => {

  
   // ১. Popup বন্ধ
  const closePopupBtn = page.getByTitle('x').getByRole('img').nth(1);
  await expect(closePopupBtn).toBeVisible();
  await closePopupBtn.click();
  console.log('✅ Closed popup');

  // ২. Bet Accounts এ যান
  const betAccounts = page.getByText('Bet Accounts');
  await expect(betAccounts).toBeVisible();
  await betAccounts.click();
  console.log('✅ Navigated to Bet Accounts');

  // ৩. Deposit বাটনে ক্লিক
  const depositBtn = page.getByRole('main').getByRole('button', { name: 'Deposit' });
  await expect(depositBtn).toBeVisible();
  await depositBtn.click();
  console.log('✅ Clicked Deposit');

  // ৪. DBBL Bank নির্বাচন
  const bankOption = page.getByText('DBBL Bank');
  await expect(bankOption).toBeVisible();
  await bankOption.click();
  console.log('✅ Selected DBBL Bank');

  // ✅ Upload File
  const filePath = path.resolve(__dirname, '../../src/images/image01.jpg');
  const fileInput = page.locator('input[type="file"]');

  // ⛔ Do NOT wait for visibility — file inputs are often hidden
  await fileInput.setInputFiles(filePath);
  console.log('✅ File uploaded');

  // ৬. Account Name ইনপুট
  const nameInput = page.getByRole('textbox', { name: 'Account Name...' });
  await expect(nameInput).toBeVisible();
  await nameInput.fill('hhhhhhhh');
  await expect(nameInput).toHaveValue('hhhhhhhh');
  console.log('✅ Filled Account Name');

  // ৭. Account Number ইনপুট
  const numberInput = page.getByRole('textbox', { name: 'Account No...' });
  await expect(numberInput).toBeVisible();
  await numberInput.fill('2342342342324');
  await expect(numberInput).toHaveValue('2342342342324');
  console.log('✅ Filled Account Number');

  // ৮. Deposit Amount ইনপুট
  const amountInput = page.getByRole('textbox', { name: 'Enter Deposit Amount' });
  await expect(amountInput).toBeVisible();
  await amountInput.fill('30');
  await expect(amountInput).toHaveValue('30');
  console.log('✅ Filled Deposit Amount');

  // ৯. Submit Request
  const submitBtn = page.getByRole('button', { name: 'Submit Request' });
  await expect(submitBtn).toBeVisible();
  await submitBtn.click();
  console.log('✅ Submitted request');

  // 🔟 Confirm deposit
  await page.waitForSelector('text=Bet Account Deposit', { timeout: 10000 });
  const confirmBtn = page.getByText('Bet Account Deposit');
  await expect(confirmBtn).toBeVisible();
  await confirmBtn.click();
  console.log('✅ Confirmed deposit');

  // ১১. Cancel
  const cancelBtn = page.getByRole('button', { name: 'Cancel' });
  await expect(cancelBtn).toBeVisible();
  await cancelBtn.click();
  console.log('✅ Clicked Cancel');

  const yesBtn = page.getByRole('button', { name: 'Yes' });
  await expect(yesBtn).toBeVisible();
  await yesBtn.click();
  console.log('✅ Confirmed Cancel');

  // ১২. Final success message
  const successMsg = page.getByText('deposit request successfully');
  await expect(successMsg).toBeVisible();
  console.log('🎉Deposit request cancelled successfully');
  });
});
