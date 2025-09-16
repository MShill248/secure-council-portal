const express = require('express')
const cors = require('cors')

const authRouter = require('./routers/auth')
const userRouter = require('./routers/user')
const logger = require('./middleware/logger')

const app = express()
app.use(express.json())
app.use(cors())
app.use(logger)

app.use('/auth', authRouter)
app.use('/user', userRouter)

app.get("/", (req, res) => {
  res.status(200).json({
    title: "SCP API",
    description: "Submit requests"
  })
})

module.exports = {
    app
}