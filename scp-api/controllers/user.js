const User = require('../models/User')

async function index(req, res) {
    try {
        const users = await User.getAll()
        res.status(200).json(users)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
}

async function showId(req, res) {
    try {
        const id = req.userId
        const user = await User.getOneById(id)
        res.status(200).json(user)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function create(req, res) {
    try {
        const data = req.body
        const newUser = await User.create(data)
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ "error": err.message })
    }
}

async function update(req, res) {
    try {
        const id = req.userId
        const user = await User.getOneById(id)
        req.body.username ||= user.username
        req.body.first_name ||= user.first_name
        req.body.last_name ||= user.last_name
        req.body.email ||= user.email
        req.body.password ||= user.password
        req.body.dob ||= user.address
        req.body.postcode ||= user.postcode
        req.body.borough ||= user.borough
        req.body.phone_number ||= user.phone_number
        req.body.user_role ||= user.user_role
        console.log(req.body);
        const data = req.body
        const result = await user.update(data)
        res.status(200).json(result)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function destroy(req, res) {
    try {
        const id = req.userId
        const user = await User.getOneById(id)
        await user.destroy()
        res.status(204).end()
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

module.exports = {
    index,
    showId,
    create,
    update,
    destroy
}