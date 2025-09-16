const User = require('../models/User')

const otpStore = {};

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
        let id = parseInt(req.params.id)
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
        const id = parseInt(req.params.id)
        const data = req.body
        const user = await User.getOneById(id)
        const result = await user.update(data)
        res.status(200).json(result)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function destroy(req, res) {
    try {
        const id = parseInt(req.params.id)
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