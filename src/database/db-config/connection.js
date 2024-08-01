const pg = require("pg");

const { Pool } = pg;

require("dotenv").config();

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DBPORT,

  max: 10,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 10000,
  allowExitOnIdle: false,
});

// IIFE
(async () => {
  let client;

  try {
    client = await pool.connect();
    console.log("DB Connected Successfully");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  } finally {
    if (client) {
      client.release();
    }
  }
})();

module.exports = { pool };
