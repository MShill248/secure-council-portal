require("dotenv").config();
const { Pool } = require("pg")

let db
if (process.env.TEST_ENV) {
  console.log("🧪 Connecting to TEST database...")
  db = new Pool({
    host: "localhost",
    port: 5433,
    user: "testuser",
    password: "testpassword",
    database: "testdb",
  })
}
else {
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
module.exports = db