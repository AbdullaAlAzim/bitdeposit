// src/utils/db.js
const mysql = require('mysql2/promise');
require('dotenv').config({ path: './configs/test.env' });

const db = {
  async getConnection() {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });
      return connection;
    } catch (err) {
      console.error('❌ database connection error:', err.message);
      throw err;
    }
  },

  async findUserByEmail(email) {
    const conn = await db.getConnection();
    const [rows] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);
    await conn.end();
    return rows[0];
  },

  async findUserByPhone(phone) {
    const conn = await db.getConnection();
    const [rows] = await conn.execute('SELECT * FROM users WHERE mobile = ?', [phone]); // ✅ Updated
    await conn.end();
    return rows[0];
  }
};

module.exports = db;
