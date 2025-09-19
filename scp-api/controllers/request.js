const Request = require('../models/Request')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

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
        const user_id = req.userId
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

async function getByCategory(req, res) {
    try {
        const category = req.params.category
        const requests = await Request.getByCategory(category)
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
        const { title, description, status, category, priority, type } = req.body
        const username = req.username 
        const user = await User.getOneByUsername(username)
        const user_id = user.user_id
        const newRequest = await Request.create({
            user_id,
            title,
            description,
            status,
            category, 
            priority,
            type
        })
        console.log("hit");
        res.status(201).json(newRequest);
    } catch (err) {
        res.status(400).json({ "error": err.message })
    }
}

async function update(req, res) {
    try {
        const id = parseInt(req.params.id)
        const request = await Request.getOneById(id)
        req.body.title ||= request.title
        req.body.description ||= request.description
        req.body.status ||= request.status
        req.body.category ||= request.category
        req.body.priority ||= request.priority
        req.body.type ||= request.type
        const data = req.body
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
    getByCategory,
    getByRecent,
    create,
    update,
    destroy
}