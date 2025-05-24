import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import db from "../../src/utils/db";

// JSON file path
const emailUserPath = path.join(
  __dirname,
  "../../src/utils/testEmailUser.json"
);
const mobileUserPath = path.join(
  __dirname,
  "../../src/utils/testMobileUser.json"
);

// ইমেইল রেজিস্ট্রেশন টেস্ট
test("UI Registration and DB Verification (Email)", async ({ page }) => {
  page.setDefaultTimeout(60000);


  const randomEmail = `rashed${Math.floor(Math.random() * 10000)}@softic.ai`;
  const password = "password123";
  const otpCode = "123456";

  await page.goto("https://dev-user.bitdeposit.org/");
  await page
    .getByRole("banner")
    .getByRole("button", { name: "রেজিস্ট্রেশন" })
    .click();
  await page
    .locator("div")
    .filter({ hasText: /^ইমেইল$/ })
    .nth(2)
    .click();

  await page.getByRole("textbox", { name: "ইমেইল*" }).fill(randomEmail);
  await page.getByRole("textbox", { name: "পাসওয়ার্ড*" }).fill(password);
  await page.getByRole("button", { name: "সাইন আপ" }).click();

  // Registration API response status 200 পাওয়ার পর লগ দেখানো
  await page
    .waitForResponse(
      (response) =>
        response.url().includes("/api/v1/user/register") &&
        response.status() === 200,
      { timeout: 60000 }
    )
    .then((response) => {
      console.log(
        `✅ Registration API responded with status: ${response.status()}`
      );
    });

  await page.waitForSelector("#otp", { state: "visible" });
  const otpInputs = await page.$$("input.ant-otp-input");
  await expect(otpInputs).toHaveLength(6);
  for (let i = 0; i < otpCode.length; i++) {
    await otpInputs[i].fill(otpCode[i]);
  }

  const confirmButton = await page.locator(
    '//button[span[text()="নিশ্চিত করুন"]]'
  );
  await expect(confirmButton).toBeEnabled();
  await confirmButton.click();
  await page.waitForTimeout(2000);

  // Save user data to JSON
  const emailUserData = {
    email: randomEmail,
    password,
    otp: otpCode,
    registrationTime: new Date().toISOString(),
  };
  fs.writeFileSync(emailUserPath, JSON.stringify([emailUserData], null, 2));
  console.log("✅ Email user saved to testEmailUser.json");

  await new Promise((res) => setTimeout(res, 1000));
  const userFromDb = await db.findUserByEmail(randomEmail);

  console.log(":package: User from DB:", userFromDb);
  expect(userFromDb).toBeDefined();
  expect(userFromDb.email).toBe(randomEmail);
  expect(userFromDb.company).toBe("bitdeposit");
  if (userFromDb.verified !== undefined) expect(userFromDb.verified).toBe(1);
  if (userFromDb.status !== undefined) expect(userFromDb.status).toBe(1);
});

// মোবাইল রেজিস্ট্রেশন টেস্ট
test("UI Registration and DB Verification with Phone", async ({ page }) => {
  const randomPhone =
    "019" + Math.floor(10000000 + Math.random() * 90000000).toString();
  const password = "password";
  const otpCode = "123456";

  console.log("📱 Generated Phone Number:", randomPhone);

  const mobileUserData = {
    mobile: randomPhone,
    password,
    otp: otpCode,
    registrationTime: new Date().toISOString(),
  };
  fs.writeFileSync(mobileUserPath, JSON.stringify([mobileUserData], null, 2));
  console.log("✅ Mobile user saved to testMobileUser.json");

  await page.goto("https://dev-user.bitdeposit.org/");
  await page
    .getByRole("banner")
    .getByRole("button", { name: "রেজিস্ট্রেশন" })
    .click();

  await page.getByPlaceholder("Your number").click();
  await page.getByPlaceholder("Your number").fill(randomPhone);
  await page.getByRole("textbox", { name: "পাসওয়ার্ড*" }).fill(password);

  await page
    .locator("#control-hooks span")
    .filter({ hasText: /^Bangladesh$/ })
    .nth(1)
    .click();
  await page.locator("#control-hooks").getByText("৳Bangladeshi Taka").click();
  await page.getByRole("combobox", { name: "দেশ নির্বাচন করুন*" }).fill("bdt");
  await page.getByText("Bangladeshi Taka").nth(2).click();

  await page.getByRole("button", { name: "সাইন আপ" }).click();

  // Registration API response status 200 পাওয়ার পর লগ দেখানো
  await page
    .waitForResponse(
      (res) =>
        res.url().includes("/api/v1/user/register") && res.status() === 200,
      { timeout: 60000 }
    )
    .then((response) => {
      console.log(
        `✅ Registration API responded with status: ${response.status()}`
      );
    });

  await page.waitForSelector("#otp", { state: "visible" });
  const otpInputs = await page.$$("input.ant-otp-input");
  await expect(otpInputs).toHaveLength(6);
  for (let i = 0; i < otpCode.length; i++) {
    await otpInputs[i].fill(otpCode[i]);
  }

  await page.getByRole("button", { name: "নিশ্চিত করুন" }).click();
  await page.waitForTimeout(3000);

  await new Promise((res) => setTimeout(res, 1500));
  const userFromDb = await db.findUserByPhone(randomPhone);

  console.log("📦 User from DB:", userFromDb);
  expect(userFromDb).toBeDefined();
  expect(userFromDb.mobile || userFromDb.phone).toBe(randomPhone);
  expect(userFromDb.company).toBe("bitdeposit");
  if (userFromDb.verified !== undefined) expect(userFromDb.verified).toBe(1);
  if (userFromDb.status !== undefined) expect(userFromDb.status).toBe(1);
});
