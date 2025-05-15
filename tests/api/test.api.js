const { test, expect, request } = require('@playwright/test');
const { faker } = require('@faker-js/faker'); // faker to generate random values
const fs = require('fs');
const path = require('path');
test('Register user without and then with OTP', async () => {
  const apiContext = await request.newContext();
//const { faker } = require('@faker-js/faker');
let randomUsername = faker.internet.userName().toLowerCase().replace(/[^a-z0-9]/g, '');
randomUsername = randomUsername.substring(0, 6);
if (randomUsername.length < 3) {
  randomUsername += Math.floor(Math.random() * 100); 
}
const uniqueEmail = `${randomUsername}@softic.ai`;
const password = "password";  
    //const password = faker.internet.password();  // Generates a random password
  // First request (without OTP)
  const firstResponse = await apiContext.post('https://dev-user.bitdeposit.org/api/v1/user/register', {
    data: {
      email: uniqueEmail,  // Use dynamic email
      country_id: '18',  // sent as string
      currency_id: '116',   // sent as string
      password: password,  // Use dynamic password
      password_confirmation: password,  // Use same password for confirmation
      reg_from: 'web',
      reg_ip_address: '192.168.0.1',
      mobile_device_info: 'Device: iPhone 12, OS: iOS 14.4, Resolution: 1170x2532, Network: 4G',
      browser_id: 'fixed-browser-id-12345',
      company: 'Canify',
      geodata: '{"ip":"45.248.148.179","hostname":"45-248-148-179.dotinternetbd.com","location":{"continent":{"code":"AS","name":"Asia"},"country":{"code2":"BD","code3":"BGD","name":"Bangladesh"},"state":{"name":"Dhaka","code":"BD-C"},"district":"Dhaka District","city":"Paltan","zipcode":"1212","coordinates":{"latitude":"23.80409","longitude":"90.41524"},"is_eu":false}}',
      web_device_info: 'Desktop: Windows 10, Chrome 132',
      otp: ''  // No OTP in first request
    }
  });
  const body1 = await firstResponse.json();
  console.log(':envelope_with_arrow: Response without OTP:', body1);
  // First assertion: Check the first response status
  expect(firstResponse.status()).toBe(200);  // Ensure the response status is 200
  expect(body1.status).toBe('success');      // Ensure the response has a success status
  // :white_check_mark: Wait for some time to ensure OTP is generated
  // :two: Second request (with OTP)
  const otp = '123456'; // You can also generate OTP dynamically if needed
  const secondResponse = await apiContext.post('https://dev-user.bitdeposit.org/api/v1/user/register', {
    data: {
      email: uniqueEmail,  // Same dynamic email
      country_id: '18',
      currency_id: '116',
      password: password,  // Same dynamic password
      password_confirmation: password,  // Same dynamic password
      reg_from: 'web',
      reg_ip_address: '192.168.0.1',
      mobile_device_info: 'Device: iPhone 12, OS: iOS 14.4, Resolution: 1170x2532, Network: 4G',
      browser_id: 'fixed-browser-id-12345',
      company: 'Canify',
      geodata: '{"ip":"45.248.148.179","hostname":"45-248-148-179.dotinternetbd.com","location":{"continent":{"code":"AS","name":"Asia"},"country":{"code2":"BD","code3":"BGD","name":"Bangladesh"},"state":{"name":"Dhaka","code":"BD-C"},"district":"Dhaka District","city":"Paltan","zipcode":"1212","coordinates":{"latitude":"23.80409","longitude":"90.41524"},"is_eu":false}}',
      web_device_info: 'Desktop: Windows 10, Chrome 132',
      otp: otp  // Send OTP for verification
    }
  });
  const body2 = await secondResponse.json();
  console.log(':envelope_with_arrow: Response with OTP:', body2);
  // Second assertion: Check the second response status
  expect(secondResponse.status()).toBe(200);  // Expect status to be 200 on second request
  expect(body2.status).toBe('success');      // Ensure the response has a success status
  // Save user to JSON file for later usage
  const filePath = path.join(__dirname, '../../src/utils/testUser.json');
  fs.writeFileSync(filePath, JSON.stringify(body2.data, null, 2));
}); 