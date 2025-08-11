// src/utils/db.js
const mysql = require("mysql2/promise");
require("dotenv").config({ path: "./configs/test.env" });


const sleep = (ms) => new Promise((r) => setTimeout(r, ms));


async function withRetry(fn, {
  timeoutMs = 30_000,
  minDelayMs = 300,
  maxDelayMs = 2_000,
  label = "db-op"
} = {}) {
  const start = Date.now();
  let attempt = 0;

  while (true) {
    try {
      const res = await fn();
      if (res) return res;
    } catch (err) {
      
    }

    const elapsed = Date.now() - start;
    if (elapsed >= timeoutMs) {
      throw new Error(`withRetry(${label}) timed out after ${elapsed}ms (attempts=${attempt})`);
    }

    // backoff + jitter
    const backoff = Math.min(minDelayMs * Math.pow(1.5, attempt), maxDelayMs);
    const jitter = Math.floor(Math.random() * 150);
    await sleep(backoff + jitter);
    attempt += 1;
  }
}

// ---------- connection pull ----------
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  namedPlaceholders: true,
  // optional: acquireTimeout: 10_000,
});


async function queryOne(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows?.[0];
}

const db = {
 
  async getConnection() {
    return pool.getConnection();
  },

  // ----- Users -----

  async _findUserByEmailOnce(email) {
    return queryOne(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
  },
  async _findUserByPhoneOnce(phone) {
    return queryOne(`SELECT * FROM users WHERE mobile = ? LIMIT 1`, [phone]);
  },


  async findUserByEmail(email) {
    return withRetry(() => db._findUserByEmailOnce(email), {
      label: `findUserByEmail(${email})`
    });
  },
  async findUserByPhone(phone) {
    return withRetry(() => db._findUserByPhoneOnce(phone), {
      label: `findUserByPhone(${phone})`
    });
  },

  // ----- Login logs -----
  async findLastLoginByUserEmail(email) {
    return queryOne(
      `SELECT ull.login_at
         FROM user_login_logs ull
         JOIN users u ON ull.action_by_id = u.id
        WHERE u.email = ?
        ORDER BY ull.login_at DESC
        LIMIT 1`,
      [email]
    );
  },

  async findLastLoginByUserPhone(phone) {
    return queryOne(
      `SELECT ull.login_at
         FROM user_login_logs ull
         JOIN users u ON ull.action_by_id = u.id
        WHERE u.mobile = ?
        ORDER BY ull.login_at DESC
        LIMIT 1`,
      [phone]
    );
  },

  async insertLoginLog(userId) {
   
    try {
      await pool.execute(
        `INSERT INTO user_login_logs (uuid, action_by_id, userable_id, userable_type, login_at)
         VALUES (UUID(), ?, ?, ?, NOW())`,
        [userId, userId, "App\\Models\\User"]
      );
    } catch (error) {
      console.error("❌ Error inserting login log:", error.message);
    }
  },

  // ----- Deposit / Withdraw lookups -----
  async findLatestMobileBankDepositFullInfo(mobile) {
    return queryOne(
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
  },

  async findLatestMobileWithdrawInfo(mobile) {
    return queryOne(
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
  },

  async findLatestBankWithdrawInfo(accountNumber) {
    return queryOne(
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
  },
};

module.exports = db;
