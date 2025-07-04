const mysql = require("mysql2/promise");
require("dotenv").config({ path: "./configs/test.env" });

const db = {
  async getConnection() {
    try {
      return await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });
    } catch (err) {
      console.error("❌ Database connection error:", err.message);
      throw err;
    }
  },

  async findUserByEmail(email) {
    const conn = await this.getConnection();
    const [rows] = await conn.execute(`SELECT * FROM users WHERE email = ?`, [email]);
    await conn.end();
    return rows[0];
  },

  async findUserByPhone(phone) {
    const conn = await this.getConnection();
    const [rows] = await conn.execute(`SELECT * FROM users WHERE mobile = ?`, [phone]);
    await conn.end();
    return rows[0];
  },

  async findLastLoginByUserEmail(email) {
    const conn = await this.getConnection();
    const [rows] = await conn.execute(
      `SELECT ull.login_at
       FROM user_login_logs ull
       JOIN users u ON ull.action_by_id = u.id
       WHERE u.email = ?
       ORDER BY ull.login_at DESC
       LIMIT 1`,
      [email]
    );
    await conn.end();
    return rows[0];
  },

  async findLastLoginByUserPhone(phone) {
    const conn = await this.getConnection();
    const [rows] = await conn.execute(
      `SELECT ull.login_at
       FROM user_login_logs ull
       JOIN users u ON ull.action_by_id = u.id
       WHERE u.mobile = ?
       ORDER BY ull.login_at DESC
       LIMIT 1`,
      [phone]
    );
    await conn.end();
    return rows[0];
  },

  async insertLoginLog(userId) {
    const conn = await this.getConnection();
    try {
      await conn.execute(
        `INSERT INTO user_login_logs (uuid, action_by_id, userable_id, userable_type, login_at)
         VALUES (UUID(), ?, ?, ?, NOW())`,
        [userId, userId, "App\\Models\\User"]
      );
    } catch (error) {
      console.error("❌ Error inserting login log:", error.message);
    } finally {
      await conn.end();
    }
  },

  async findLatestMobileBankDepositFullInfo(mobile) {
    const conn = await this.getConnection();
    const [rows] = await conn.execute(
      `SELECT 
         user_id,
         amount,
         status,
         trx_no,
         transaction_id,
         mobile_number
       FROM user_mobile_bank_deposit_requests
       WHERE mobile_number = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [mobile]
    );
    await conn.end();
    return rows[0];
  },

  async findLatestMobileWithdrawInfo(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ) {
    const conn = await this.getConnection();
    const [rows] = await conn.execute(
      `SELECT 
         user_id,
         amount,
         status,
         trx_no,
         mobile_number,
         created_at
       FROM user_mobile_bank_withdraw_requests
       WHERE mobile_number = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [mobile]
    );
    await conn.end();
    return rows[0];
  },

  async findLatestBankWithdrawInfo(accountNumber) {
    const conn = await this.getConnection();
    const [rows] = await conn.execute(
      `SELECT 
         user_id,
         amount,
         status,
         trx_no,
         account_number,
         bank_name,
         created_at
       FROM user_bank_withdraw_requests
       WHERE account_number = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [accountNumber]
    );
    await conn.end();
    return rows[0];
  },
};

module.exports = db;
