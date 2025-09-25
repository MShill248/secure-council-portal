require('dotenv').config();
const { Pool } = require('pg');

const isTest =
  process.env.TEST_ENV === '1' || process.env.NODE_ENV === 'test';

let db;
if (isTest) {
  // local test DB (only when running tests on your machine)
  db = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'testuser',
    password: 'testpassword',
    database: 'users',
  });
} else {
  // docker / normal runtime – use env + service name
  db = new Pool({
    host: process.env.DB_HOST,      // scp-db
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

module.exports = db;
