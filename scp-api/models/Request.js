const { ChildProcess } = require('child_process');
const db = require('../database/connect');
const encrypter = require('../encrypt/crypto')
const crypto = require('crypto');

const key = crypto.scryptSync('secretPassword', 'salt', 32);

class Request {

    constructor({ request_id, user_id, title, description, status, category, priority, type, created_at, updated_at }) {
        this.request_id = request_id,
        this.user_id = user_id,
        this.title = title,
        this.description = description,
        this.status = status,
        this.category = category,
        this.priority = priority,
        this.type = type,
        this.created_at = created_at,
        this.updated_at = updated_at
    }

    static async getAll() {
        const response = await db.query("SELECT * FROM requests;")
        if (response.rows.length === 0) {
            throw Error("No requests available")
        }
        // for(let i = 0; i < response.rows.length; i++) {
        //     encrypter.decryptRequest(response.rows[i], key)
        // }
        return response.rows.map((request) => new Request(request))
    }

    static async getOneById(id) {
        const response = await db.query("SELECT * FROM requests WHERE request_id = $1", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate request.")
        }
        // encrypter.decryptRequest(response.rows[0], key)
        return new Request(response.rows[0])
    }

    static async getByUserId(user_id) {
        const response = await db.query("SELECT * FROM requests WHERE user_id = $1", [user_id]);
        if (response.rows.length === 0) {
            throw new Error("No requests found")
        }
        // for(let i = 0; i < response.rows.length; i++) {
        //     encrypter.decryptRequest(response.rows[i], key)
        // }
        return response.rows.map((request) => new Request(request))
    }

    static async getByStatus(status) {
        const response = await db.query("SELECT * FROM requests WHERE status = $1", [status])
        if (response.rows.length === 0) {
            throw new Error("No requests found")
        }
        // for(let i = 0; i < response.rows.length; i++) {
        //     encrypter.decryptRequest(response.rows[i], key)
        // }
        return response.rows.map((request) => new Request(request))
    }

    static async getByPriority(priority) {
        const response = await db.query("SELECT * FROM requests WHERE priority = $1", [priority])
        if (response.rows.length === 0) {
            throw new Error("No requests found")
        }
        // for(let i = 0; i < response.rows.length; i++) {
        //     encrypter.decryptRequest(response.rows[i], key)
        // }
        return response.rows.map((request) => new Request(request))
    }

    static async getByCategory(category) {
        const response = await db.query("SELECT * FROM requests WHERE category = $1", [category])
        if (response.rows.length === 0) {
            throw new Error("No requests found")
        }
        // for(let i = 0; i < response.rows.length; i++) {
        //     encrypter.decryptRequest(response.rows[i], key)
        // }
        return response.rows.map((request) => new Request(request))
    }

    // static async getByTitle(title) {
    //     const response = await db.query("SELECT * FROM requests WHERE title ILIKE $1", [`%${title}%`])
    //     if (response.rows.length === 0) {
    //         throw new Error("No requests found")
    //     }
    //     return response.rows.map(request => new Request(request))
    // }

    static async getByRecent() {
        const response = await db.query("SELECT * FROM requests ORDER BY updated_at DESC, created_at DESC;")
        if (response.rows.length === 0) {
            throw new Error("No requests found")
        }
        // for(let i = 0; i < response.rows.length; i++) {
        //     encrypter.decryptRequest(response.rows[i], key)
        // }
        return response.rows.map((request) => new Request(request))
    }

    static async getByBorough(borough) {
        console.log(borough);
        const response = await db.query("SELECT r.* FROM requests r LEFT JOIN users u ON r.user_id = u.user_id WHERE u.borough = $1;", [borough])
        if (response.rows.length === 0) {
            throw new Error("No requests found")
        }
        // for(let i = 0; i < response.rows.length; i++) {
        //     encrypter.decryptRequest(response.rows[i], key)
        // }
        return response.rows.map((request) => new Request(request))
    }

    static async create(data) {
        const { user_id, title, description, status, category, priority, type } = data
        const existingUser = await db.query("SELECT user_id FROM users WHERE user_id = $1;", [user_id])
        
        if (existingUser.rows.length === 0) {
            throw Error("A user with this ID does not exist")
        }

        //const encryptedData = encrypter.encryptArray([title, description, status, category])
        const encryptedData = [title, description, status, category]
        
        let response = await db.query("INSERT INTO requests (user_id, title, description, status, category, priority, type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
            [user_id,  encryptedData[0], encryptedData[1], encryptedData[2], encryptedData[3], priority, type])
        if (response.rows.length != 1) {
            throw new Error("Unable to create request.")
        }
        return new Request(response.rows[0])
    }

    async update(data){
        const { title, description, status, category, priority, type, updated_at } = data

        //const encryptedData = encrypter.encryptArray([title, description, status, category])
        const encryptedData = [title, description, status, category]

        const response = await db.query("UPDATE requests SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status), category = COALESCE($4, category), priority = COALESCE($5, priority), type = COALESCE($6, type), updated_at = COALESCE($7, updated_at) WHERE request_id = $8 RETURNING *;",
            [encryptedData[0], encryptedData[1], encryptedData[2], encryptedData[3], priority, type, updated_at, this.request_id])
        if (response.rows.length !== 1) {
            throw Error("Unable to update request")
        }
        return new Request(response.rows[0]) 
    }

    async destroy() {
        const response = await db.query("DELETE FROM requests WHERE request_id = $1;", [this.request_id])
    }
}

class RequestBorough extends Request {
    constructor({request_id, user_id, title, description, status, category, priority, type, borough, created_at, updated_at}) {
        super({request_id, user_id, title, description, status, category, priority, type, created_at, updated_at});
        this.borough = borough
    }
    static async getByCategoryBorough(category) {
        const response = await db.query("SELECT r.*, u.borough FROM requests r LEFT JOIN users u ON r.user_id = u.user_id WHERE r.category = $1;", [category])
        if (response.rows.length === 0) {
            throw new Error("No requests found")
        }
        // for(let i = 0; i < response.rows.length; i++) {
        //     encrypter.decryptRequest(response.rows[i], key)
        // }
        return response.rows.map((request) => new RequestBorough(request))
    }
}

module.exports = {Request, RequestBorough};