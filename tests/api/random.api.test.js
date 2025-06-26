const { test, expect, request } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const db = require('../../src/utils/db');

test.setTimeout(180000); // ৩ মিনিট টাইমআউট

test('Register 50 users in 1 minute', async () => {
  // API কলে ৩০ সেকেন্ড টাইমআউট দিয়েছি
  const apiContext = await request.newContext({ timeout: 30000 });

  const failedUsers = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < 50; i++) {
    const userId = String(i + 1).padStart(3, '0');
    // ইউনিক ইমেইল: userId + timestamp + random 3-digit
    const uniqueEmail = `aaa${userId}_${Date.now()}${Math.floor(Math.random() * 1000)}@softic.ai`;
    const password = '123456';

    // STEP 1: OTP ছাড়া রেজিস্ট্রেশন
    const firstResponse = await apiContext.post('https://dev-user.bitdeposit.org/api/v1/user/register', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        email: uniqueEmail,
        country_id: '18',
        currency_id: '116',
        password,
        password_confirmation: password,
        reg_from: 'web',
        reg_ip_address: '192.168.0.1',
        mobile_device_info: 'Device: iPhone 12, OS: iOS 14.4, Resolution: 1170x2532, Network: 4G',
        browser_id: 'fixed-browser-id-12345',
        company: 'Bitdeposit',
        geodata: '{"ip":"45.248.148.179","hostname":"45-248-148-179.dotinternetbd.com","location":{"continent":{"code":"AS","name":"Asia"},"country":{"code2":"BD","code3":"BGD","name":"Bangladesh"},"state":{"name":"Dhaka","code":"BD-C"},"district":"Dhaka District","city":"Paltan","zipcode":"1212","coordinates":{"latitude":"23.80409","longitude":"90.41524"},"is_eu":false}}',
        web_device_info: 'Desktop: Windows 10, Chrome 132',
        otp: ''
      }
    });

    let body1;
    try {
      body1 = await firstResponse.json();
    } catch (err) {
      const text = await firstResponse.text();
      console.error(`🔴 (${i + 1}) STEP 1 FAILED: Non-JSON response for ${uniqueEmail}`);
      console.error(text);
      failedUsers.push({ step: 'otp-less', email: uniqueEmail, reason: 'Non-JSON response' });
      failCount++;
      continue;
    }

    if (firstResponse.status() === 200 && body1.status === 'success') {
      console.log(`🟡 (${i + 1}) STEP 1 SUCCESS: OTP ছাড়া রেজিস্ট্রেশন সফল — ${uniqueEmail}`);
    } else {
      console.error(`🔴 (${i + 1}) STEP 1 FAILED: OTP ছাড়া রেজিস্ট্রেশন ব্যর্থ — ${uniqueEmail}`, body1);
      failedUsers.push({ step: 'otp-less', email: uniqueEmail, reason: body1 });
      failCount++;
      continue;
    }

    // STEP 2: OTP সহ রেজিস্ট্রেশন
    const otp = '123456';
    const secondResponse = await apiContext.post('https://dev-user.bitdeposit.org/api/v1/user/register', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        email: uniqueEmail,
        country_id: '18',
        currency_id: '116',
        password,
        password_confirmation: password,
        reg_from: 'web',
        reg_ip_address: '192.168.0.1',
        mobile_device_info: 'Device: iPhone 12, OS: iOS 14.4, Resolution: 1170x2532, Network: 4G',
        browser_id: 'fixed-browser-id-12345',
        company: 'Bitdeposit',
        geodata: '{"ip":"45.248.148.179","hostname":"45-248-148-179.dotinternetbd.com","location":{"continent":{"code":"AS","name":"Asia"},"country":{"code2":"BD","code3":"BGD","name":"Bangladesh"},"state":{"name":"Dhaka","code":"BD-C"},"district":"Dhaka District","city":"Paltan","zipcode":"1212","coordinates":{"latitude":"23.80409","longitude":"90.41524"},"is_eu":false}}',
        web_device_info: 'Desktop: Windows 10, Chrome 132',
        otp
      }
    });

    let body2;
    try {
      body2 = await secondResponse.json();
    } catch (err) {
      const text = await secondResponse.text();
      console.error(`🔴 (${i + 1}) STEP 2 FAILED: Non-JSON response for ${uniqueEmail}`);
      console.error(text);
      failedUsers.push({ step: 'otp-verify', email: uniqueEmail, reason: 'Non-JSON response' });
      failCount++;
      continue;
    }

    if (secondResponse.status() === 200 && body2.status === 'success') {
      console.log(`🟢 (${i + 1}) STEP 2 SUCCESS: OTP সহ রেজিস্ট্রেশন সফল — ${uniqueEmail}`);
    } else {
      console.error(`🔴 (${i + 1}) STEP 2 FAILED: OTP সহ রেজিস্ট্রেশন ব্যর্থ — ${uniqueEmail}`, body2);
      failedUsers.push({ step: 'otp-verify', email: uniqueEmail, reason: body2 });
      failCount++;
      continue;
    }

    // Save user data
    const filePath = path.join(__dirname, `../../src/utils/testUsers/user_${userId}.json`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(body2.data, null, 2));

    // Database verification
    await new Promise(res => setTimeout(res, 500));
    const userFromDb = await db.findUserByEmail(uniqueEmail);

    console.log(`📦 (${i + 1}) DB RESULT:`, userFromDb);

    expect(userFromDb).toBeDefined();
    expect(userFromDb.email).toBe(uniqueEmail);
    expect(userFromDb.company).toBe('Bitdeposit');
    if (userFromDb.verified !== undefined) {
      expect(userFromDb.verified).toBe(1);
    }
    if (userFromDb.status !== undefined) {
      expect(userFromDb.status).toBe(1);
    }

    if (userFromDb.country_id === 18) {
      console.log(`🇧🇩 (${i + 1}) BD User Registered ✅
        📧 Email: ${userFromDb.email}
        🏢 Company: ${userFromDb.company}
        🔐 Verified: ${userFromDb.verified}
        ✅ Status: ${userFromDb.status}
      `);
    }

    successCount++;

    // একটু বিরতি (200ms) দিলাম যাতে সার্ভারে চাপ কম পড়ে
    await new Promise(res => setTimeout(res, 200));
  }

  // Summary
  console.log(`\n✅ Total Success: ${successCount}`);
  console.log(`❌ Total Failed: ${failCount}`);

  if (failedUsers.length > 0) {
    console.log('\n🔴 Failed Users Summary:');
    failedUsers.forEach((fail, idx) => {
      console.log(`(${idx + 1}) Step: ${fail.step}, Email: ${fail.email}, Reason: ${JSON.stringify(fail.reason)}`);
    });
  }
});
