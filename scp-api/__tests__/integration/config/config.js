// process.env.TEST_ENV = "true"

// const { Pool } = require("pg")
// const fs = require("fs")
// const path = require("path")

// const dbResetSQL = fs.readFileSync(
//   path.join(__dirname, "resetFiles", "scp-database-reset.sql")
// ).toString()

// const resetTestDB = async () => {
//   const db = new Pool({
//     host: "localhost",
//     port: 5433,
//     user: "testuser",
//     password: "testpassword",
//     database: "testdb",
//   })

//   try {
//     // Run each reset file individually
//     await db.query(dbResetSQL)

//     console.log("✅ Test DB reset complete")
//   } catch (err) {
//     console.error("❌ Error resetting DB:", err)
//     throw err
//   } finally {
//     await db.end()
//   }
// }

// module.exports = { resetTestDB }
