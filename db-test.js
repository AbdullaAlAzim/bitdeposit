/* 
Db Connection Test
*/
const mysql = require('mysql2/promise');
require('dotenv').config({ path: './configs/test.env' });

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    console.log('✅ Connected to the database! And Now Its 100% Working');
    const [rows] = await conn.execute('SHOW TABLES');
    console.log('📦 Tables:', rows);
    await conn.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
})();
