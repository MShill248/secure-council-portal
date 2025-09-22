const db = require('../database/connect');
const encrypter = require('../encrypt/crypto');
const crypto = require('crypto');

const key = crypto.scryptSync('secretPassword', 'salt', 32);

class Message {

    constructor({ message_id, request_id, sender_id, receiver_id, content, timestamp }) {
        this.message_id = message_id,
        this.request_id = request_id,
        this.sender_id = sender_id,
        this.receiver_id = receiver_id,
        this.content = content,
        this.timestamp = timestamp
    }

    static async getAll() {
        const response = await db.query("SELECT * FROM messages ORDER BY timestamp DESC;")
        if (response.rows.length === 0) {
            throw Error("No requests available")
        }
        // for(let i = 0; i < response.rows.length; i++) {
        //     encrypter.decryptMessage(response.rows[i], key)
        // }
        return response.rows.map((message) => new Message(message))
    }

    static async getOneById(id) {
        const response = await db.query("SELECT * FROM messages WHERE message_id = $1", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate request.")
        }
        //encrypter.decryptMessage(response.rows[0], key)
        return new Message(response.rows[0])
    }

    // static async getByUserId(user_id) {
    //     const response = await db.query("SELECT * FROM requests WHERE user_id = $1", [user_id]);
    //     if (response.rows.length === 0) {
    //         throw new Error("No requests found")
    //     }
    //     return response.rows.map((request) => new Request(request))
    // }
    
    static async getByRequestId(request_id) {
        const response = await db.query("SELECT * FROM messages WHERE request_id = $1", [request_id]);
        if (response.rows.length === 0) {
            throw new Error("No requests found")
        }
        // for(let i = 0; i < response.rows.length; i++) {
        //     encrypter.decryptMessage(response.rows[i], key)
        // }
        return response.rows.map((message) => new Message(message))
    }

    static async create(data) {
        const { request_id, sender_id, receiver_id, content } = data
        const existingUser = await db.query("SELECT user_id FROM users WHERE user_id = $1;", [sender_id])

        if (existingUser.rows.length === 0) {
            throw Error("A user with this ID does not exist")
        }

        //const encryptedData = encrypter.encryptArray([content])
        const encryptedData = [content]

        let response = await db.query("INSERT INTO messages (request_id, sender_id, receiver_id, content) VALUES ($1, $2, $3, $4) RETURNING *;",
            [request_id, sender_id, receiver_id, encryptedData[0]])
        if (response.rows.length != 1) {
            throw new Error("Unable to create request.")
        }
        return new Message(response.rows[0])
    }

    async update(data){
        const {content, timestamp} = data

        //const encryptedData = encrypter.encryptArray([content])
        const encryptedData = [content]

        const response = await db.query("UPDATE messages SET content = COALESCE($1, content), timestamp = COALESCE($2, timestamp) WHERE message_id = $3 RETURNING *;",
            [encryptedData[0], timestamp, this.message_id])
        if (response.rows.length !== 1) {
            throw Error("Unable to update request")
        }
        return new Message(response.rows[0]) 
    }

    async destroy() {
        const response = await db.query("DELETE FROM messages WHERE message_id = $1;", [this.message_id])
    }
}

module.exports = Message;