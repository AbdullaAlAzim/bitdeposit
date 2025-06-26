import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import db from "../../src/utils/db";

const testEmailUserPath = path.join(
  __dirname,
  "../../src/utils/testEmailUser.json"
);
const testMobileUserPath = path.join(
  __dirname,
  "../../src/utils/testMobileUser.json"
);

const emailUser = JSON.parse(fs.readFileSync(testEmailUserPath, "utf-8"))[0];
const mobileUser = JSON.parse(fs.readFileSync(testMobileUserPath, "utf-8"))[0];

test.describe("User Login with API Status and DB Verification ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://dev-user.bitdeposit.org/");
  });

  test("Login with Email and verify DB @regression", async ({ page }, testInfo) => {
    console.log(`🔁 Retry Count: ${testInfo.retry}`);
    await page.getByRole("button", { name: "লগইন" }).click();

    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/v1/user/login") && res.status() === 200
      ),
      (async () => {
        await page
          .getByRole("textbox", { name: "ইমেইল অথবা অ্যাকাউন্ট আইডি" })
          .fill(emailUser.email);
        await page
          .getByRole("textbox", { name: "Enter your password" })
          .fill(emailUser.password);
        await page
          .getByRole("dialog")
          .getByRole("button", { name: "লগইন" })
          .click();
      })(),
    ]);

    expect(response.status()).toBe(200);
    console.log(`✅ Login API responded with status 200`);

    await expect(page.locator("text=Successfully Logged In")).toBeVisible({
      timeout: 3000,
    });
    console.log(`🎉 Login success confirmed: Email User - ${emailUser.email}`);

    const userFromDb = await db.findUserByEmail(emailUser.email);
    expect(userFromDb).toBeDefined();

    console.log(`🆔 User ID: ${userFromDb.id}`);
    console.log(`📧 Email: ${userFromDb.email}`);
    console.log(`📱 Phone: ${userFromDb.mobile || userFromDb.phone}`);

    let lastLogin = await db.findLastLoginByUserEmail(emailUser.email);
    if (lastLogin && lastLogin.login_at) {
      console.log(`🕒 Last login time: ${lastLogin.login_at}`);
    } else {
      console.log(
        "⚠️ No login log found for this email user, inserting now..."
      );
      await db.insertLoginLog(userFromDb.id);
      lastLogin = await db.findLastLoginByUserEmail(emailUser.email);
      if (lastLogin)
        console.log(`🕒 New login time after insert: ${lastLogin.login_at}`);
    }
  });

  test("Login with Phone and verify DB @regression ", async ({ page }, testInfo) => {
    console.log(`🔁 Retry Count: ${testInfo.retry}`);
    await page.getByRole("button", { name: "লগইন" }).click();

    await page
      .locator("form")
      .filter({ hasText: "ইমেইল অথবা অ্যাকাউন্ট আইডি" })
      .getByRole("img")
      .nth(2)
      .click();

    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/v1/user/login") && res.status() === 200
      ),
      (async () => {
        await page.getByPlaceholder("Your number").fill(mobileUser.mobile);
        await page
          .getByRole("textbox", { name: "Enter your password" })
          .fill(mobileUser.password);
        await page
          .getByRole("dialog")
          .getByRole("button", { name: "লগইন" })
          .click();
      })(),
    ]);

    expect(response.status()).toBe(200);
    console.log(`✅ Login API responded with status 200`);

    await expect(page.locator("text=Successfully Logged In")).toBeVisible({
      timeout: 3000,
    });
    console.log(
      `🎉 Login success confirmed: Mobile User - ${mobileUser.mobile}`
    );

    const userFromDb = await db.findUserByPhone(mobileUser.mobile);
    expect(userFromDb).toBeDefined();

    console.log(`🆔 User ID: ${userFromDb.id}`);
    console.log(`📧 Email: ${userFromDb.email}`);
    console.log(`📱 Phone: ${userFromDb.mobile || userFromDb.phone}`);

    let lastLogin = await db.findLastLoginByUserPhone(mobileUser.mobile);
    if (lastLogin && lastLogin.login_at) {
      console.log(`🕒 Last login time: ${lastLogin.login_at}`);
    } else {
      console.log(
        "⚠️ No login log found for this mobile user, inserting now..."
      );
      await db.insertLoginLog(userFromDb.id);
      lastLogin = await db.findLastLoginByUserPhone(mobileUser.mobile);
      if (lastLogin)
        console.log(`🕒 New login time after insert: ${lastLogin.login_at}`);
    }
  });

  
});
