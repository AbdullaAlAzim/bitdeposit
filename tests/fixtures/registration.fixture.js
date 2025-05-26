const fs = require("fs");
import db from "../../src/utils/db"; // Update with your actual DB utility path

async function registerWithEmail(page) {
  const randomEmail = `rashed${Math.floor(Math.random() * 10000)}@softic.ai`;
  const password = "password123";
  const otpCode = "123456";

  await page.goto("https://dev-user.bitdeposit.org/");
  await page.getByRole("banner").getByRole("button", { name: "রেজিস্ট্রেশন" }).click();

  await page.locator("div").filter({ hasText: /^ইমেইল$/ }).nth(2).click();
  await page.getByRole("textbox", { name: "ইমেইল*" }).fill(randomEmail);
  await page.getByRole("textbox", { name: "পাসওয়ার্ড*" }).fill(password);
  await page.getByRole("button", { name: "সাইন আপ" }).click();

  await page.waitForResponse(response =>
    response.url().includes("/api/v1/user/register") && response.status() === 200
  );

  await page.waitForSelector("#otp", { state: "visible" });
  const otpInputs = await page.$$("input.ant-otp-input");
  for (let i = 0; i < otpCode.length; i++) {
    await otpInputs[i].fill(otpCode[i]);
  }

  const confirmButton = await page.locator('//button[span[text()="নিশ্চিত করুন"]]');
  await confirmButton.click();
  await page.waitForTimeout(2000);

  const emailUserData = {
    email: randomEmail,
    password,
    otp: otpCode,
    registrationTime: new Date().toISOString(),
  };

  const emailUserPath = "testEmailUser.json";
  fs.writeFileSync(emailUserPath, JSON.stringify([emailUserData], null, 2));
  console.log("✅ Email user saved to testEmailUser.json");

  const userFromDb = await db.findUserByEmail(randomEmail);
  return { emailUserData, userFromDb };
}

module.exports = {
  registerWithEmail
};
