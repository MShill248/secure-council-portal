const Request = require('../models/Request')

async function index(req, res) {
    try {
        const requests = await Request.getAll()
        res.status(200).json(requests)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
}

async function showId(req, res) {
    try {
        let id = parseInt(req.params.id)
        const request = await Request.getOneById(id)
        res.status(200).json(request)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function getByUserId(req, res) {
    try {
        const user_id = parseInt(req.params.user_id)
        const requests = await Request.getByUserId(user_id)
        res.status(200).json(requests)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
}

async function getByStatus(req, res) {
    try {
        const status = req.params.status
        const requests = await Request.getByStatus(status)
        res.status(200).json(requests)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
}

async function getByPriority(req, res) {
    try {
        const priority = req.params.priority
        const requests = await Request.getByPriority(priority)
        res.status(200).json(requests)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
}

async function getByRecent(req, res) {
    try {
        const requests = await Request.getByRecent()
        res.status(200).json(requests)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function create(req, res) {
    try {
        const { title, description, status } = req.body
        const user_id = req.user.user_id // should get user_id from auth middleware to pass to model
        const newRequest = await Request.create({
            user_id,
            title,
            description,
            status,
            created_at: new Date(),
            updated_at: new Date(),
        })
        res.status(201).json(newRequest);
    } catch (err) {
        res.status(400).json({ "error": err.message })
    }
}

async function update(req, res) {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const request = await Request.getOneById(id)
        data.updated_at = new Date()
        const result = await request.update(data)
        res.status(200).json(result)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function destroy(req, res) {
    try {
        const id = parseInt(req.params.id)
        const request = await Request.getOneById(id)
        await request.destroy()
        res.status(204).end()
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

module.exports = {
    index,
    showId,
    getByUserId,
    getByStatus,
    getByPriority,
    getByRecent,
    create,
    update,
    destroy
}