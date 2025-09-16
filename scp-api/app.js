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

module.exports = {
    app
}