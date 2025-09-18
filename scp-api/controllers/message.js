const Message = require('../models/Message')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

async function index(req, res) {
    try {
        const requests = await Message.getAll()
        res.status(200).json(requests)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
}

async function showId(req, res) {
    try {
        let id = parseInt(req.params.id)
        const request = await Message.getOneById(id)
        res.status(200).json(request)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

// async function getByUserId(req, res) {
//     try {
//         const user_id = parseInt(req.params.user_id)
//         const requests = await Message.getByUserId(user_id)
//         res.status(200).json(requests)
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: err.message })
//     }
// }

async function getByRequestId(req, res) {
    try {
        const request_id = parseInt(req.params.request_id)
        const requests = await Message.getByRequestId(request_id)
        res.status(200).json(requests)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
}

async function create(req, res) {
    try {
        const { request_id, receiver_id, content, token} = req.body
        const payload = jwt.verify(token, process.env.SECRET_TOKEN)
        const username = payload.username 
        const user = await User.getOneByUsername(username)
        const sender_id = user.user_id
        const newMessage = await Message.create({
            request_id,
            sender_id,
            receiver_id,
            content            
        })
        console.log("hit");
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(400).json({ "error": err.message })
    }
}

async function update(req, res) {
    try {
        const id = parseInt(req.params.id)
        const message = await Message.getOneById(id)
        const {content, token} = req.body
        const payload = jwt.verify(token, process.env.SECRET_TOKEN)
        const username = payload.username 
        const user = await User.getOneByUsername(username)
        const user_id = user.user_id
        const timestamp = new Date()
        if(user_id == message.sender_id){
            const data = {content, timestamp}
            const result = await message.update(data)
            res.status(200).json(result)
        }
        else {
            throw Error('User not permitted to update this message')
        }
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function destroy(req, res) {
    try {
        const id = parseInt(req.params.id)
        const { token } = req.body
        const payload = jwt.verify(token, process.env.SECRET_TOKEN)
        const username = payload.username 
        const user = await User.getOneByUsername(username)
        const user_id = user.user_id
        const message = await Message.getOneById(id)
        if(user_id == message.sender_id){
            await message.destroy()
            res.status(204).end()
        }
        else{
            throw Error("You are not permitted to delete this message")
        }
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

module.exports = {
    index,
    showId,
    //getByUserId,
    getByRequestId,
    create,
    update,
    destroy
}