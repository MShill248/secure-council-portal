require("dotenv").config();
const { Pool } = require("pg")

let db

if (process.env.TEST_ENV) {
  console.log("🧪 Connecting to TEST database...")
  db = new Pool({
    host: "localhost",
    port: 5432,
    // user: "testuser",
    user: "postgres",
    // password: "testpassword",
    password: "docker",
    // database: "testdb",
    database: "users",
  })
}
// } else {
//   db = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//   })
// }
module.exports = db