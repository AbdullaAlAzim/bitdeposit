const { test, expect, request } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');
const db = require('../../src/utils/db');

test('Register user using API with OTP and verify in DB', async () => {
  const apiContext = await request.newContext();

  // Step 1: Generate unique email
  let randomUsername = faker.internet.userName().toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 6);
  if (randomUsername.length < 3) {
    randomUsername += Math.floor(Math.random() * 100);
  }
  const uniqueEmail = `${randomUsername}@softic.ai`;
  const password = 'password';

  // Common payload base
  const payloadBase = {
    email: uniqueEmail,
    country_id: '18',
    currency_id: '116',
    password,
    password_confirmation: password,
    reg_from: 'web',
    reg_ip_address: '192.168.0.1',
    mobile_device_info: 'Device: iPhone 12, OS: iOS 14.4, Resolution: 1170x2532, Network: 4G',
    browser_id: 'fixed-browser-id-12345',
    company: 'Canify',
    geodata: '{"ip":"45.248.148.179","hostname":"45-248-148-179.dotinternetbd.com","location":{"continent":{"code":"AS","name":"Asia"},"country":{"code2":"BD","code3":"BGD","name":"Bangladesh"},"state":{"name":"Dhaka","code":"BD-C"},"district":"Dhaka District","city":"Paltan","zipcode":"1212","coordinates":{"latitude":"23.80409","longitude":"90.41524"},"is_eu":false}}',
    web_device_info: 'Desktop: Windows 10, Chrome 132'
  };

  // Step 2: Register without OTP
  const firstResponse = await apiContext.post('https://dev-user.bitdeposit.org/api/v1/user/register', {
    data: { ...payloadBase, otp: '' }
  });

  const body1 = await firstResponse.json();
  console.log('🟡 Initial Registration Response (without OTP):', body1);
  expect(firstResponse.status()).toBe(200);
  expect(body1.status).toBe('success');

  // Step 3: Complete registration with OTP
  const otp = '123456';
  const secondResponse = await apiContext.post('https://dev-user.bitdeposit.org/api/v1/user/register', {
    data: { ...payloadBase, otp }
  });

  const body2 = await secondResponse.json();
  console.log('🟢 Final Registration Response (with OTP):', body2);
  expect(secondResponse.status()).toBe(200);
  expect(body2.status).toBe('success');

  // Step 4: Save user data to test file (optional)
  const filePath = path.join(__dirname, '../../src/utils/testUser.json');
  fs.writeFileSync(filePath, JSON.stringify(body2.data, null, 2));

  // Step 5: DB verify (delay to ensure DB write)
  await new Promise(resolve => setTimeout(resolve, 1000));
  const userFromDb = await db.findUserByEmail(uniqueEmail);
  console.log('📦 DB User Lookup:', userFromDb);

  // Step 6: Assert DB data
  expect(userFromDb).toBeDefined();
  expect(userFromDb.email).toBe(uniqueEmail);
  expect(userFromDb.company).toBe('Canify');

  if (userFromDb.verified !== undefined) {
    expect(userFromDb.verified).toBe(1);
  }

  if (userFromDb.status !== undefined) {
    expect(userFromDb.status).toBe(1);
  }

  // Step 7: Report-friendly Log
  if (userFromDb.country_id === 18) {
    console.log(`✅ 🇧🇩 BD User Registration Verified:
      📧 Email: ${userFromDb.email}
      🏢 Company: ${userFromDb.company}
      🔐 Verified: ${userFromDb.verified}
      ✅ Status: ${userFromDb.status}
    `);
  }
});
