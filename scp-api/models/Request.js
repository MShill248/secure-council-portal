const db = require('../database/connect');

class Request {

    constructor({ request_id, user_id, title, description, status, created_at, updated_at }) {
        this.request_id = request_id,
        this.user_id = user_id,
        this.title = title,
        this.description = description,
        this.status = status,
        this.created_at = created_at,
        this.updated_at = updated_at
    }

    static async getAll() {
        const response = await db.query("SELECT * FROM requests;")
        if (response.rows.length === 0) {
            throw Error("No requests available")
        }
        return response.rows.map((request) => new Request(request))
    }

    static async getOneById(id) {
        const response = await db.query("SELECT * FROM requests WHERE request_id = $1", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate request.")
        }
        return new Request(response.rows[0])
    }

    static async getByUserId(user_id) {
        const response = await db.query("SELECT * FROM requests WHERE user_id = $1", [user_id]);
        if (response.rows.length === 0) {
            throw new Error("No requests found")
        }
        return response.rows.map((request) => new Request(request))
    }

    static async getByStatus(status) {
        const response = await db.query("SELECT * FROM requests WHERE status = $1", [status])
        if (response.rows.length === 0) {
            throw new Error("No requests found")
        }
        return response.rows.map((request) => new Request(request))
    }

    static async getByPriority(priority) {
        const response = await db.query("SELECT * FROM requests WHERE priority = $1", [priority])
        if (response.rows.length === 0) {
            throw new Error("No requests found")
        }
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
        return response.rows.map((request) => new Request(request))
    }

    static async create(data) {
        const {user_id, title, description, status, created_at, updated_at} = data
        const existingUser = await db.query("SELECT user_id FROM users WHERE user_id = $1;", [userid])

        if (existingUser.rows.length === 0) {
            throw Error("A user with this ID does not exist")
        }

        let response = await db.query("INSERT INTO requests (user_id, title, description, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
            [user_id, title, description, status, created_at, updated_at])
        if (response.rows.length != 1) {
            throw new Error("Unable to create request.")
        }
        return new Request(response.rows[0])
    }

    async update(data){
        const { title, description, status, updated_at } = data

        const response = await db.query("UPDATE requests SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status), updated_at = COALESCE($4, updated_at) WHERE request_id = $5 RETURNING *;",
            [title, description, status, updated_at, this.request_id])
        if (response.rows.length !== 1) {
            throw Error("Unable to update request")
        }
        return new Request(response.rows[0]) 
    }

    async destroy() {
        const response = await db.query("DELETE FROM requests WHERE request_id = $1;", [this.request_id])
    }
}

module.exports = Request;