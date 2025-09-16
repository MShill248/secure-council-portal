const db = require('../database/connect');

class User {

    constructor({ user_id, username, password, high_score = 0, is_admin }) {
        this.id = user_id;
        this.username = username;
        this.password = password;
        this.high_score = high_score;
        this.isAdmin = is_admin;
    }

    static async getOneById(id) {
        const response = await db.query("SELECT * FROM user_account WHERE user_id = $1", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async getOneByUsername(username) {
        const response = await db.query("SELECT * FROM user_account WHERE username = $1", [username]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async create(data) {
        const { username, password, isAdmin } = data;
        let response = await db.query("INSERT INTO user_account (username, password, high_score) VALUES ($1, $2, 0) RETURNING user_id;",
            [username, password]);
        const newId = response.rows[0].user_id;
        const newUser = await User.getOneById(newId);
        return newUser;
    }

    async update(data){
        const { username, first_name, last_name, email, password, dob, address, postcode, borough, phone_number } = data

        const response = await db.query("UPDATE userinfo SET username = COALESCE($1, username) first_name = COALESCE($2, first_name), last_name = COALESCE($3, last_name), email = COALESCE($4, email), password = COALESCE($5, passwordhash), dob = COALESCE($6, dob), address = COALESCE($7, address), postcode = COALESCE($8, postcode), borough = COALESCE($9, borough), phone_number = COALESCE($10, phone_number) WHERE user_id = $11 RETURNING *;", [username, first_name, last_name, email, password, dob, address, postcode, borough, phone_number, this.user_id])
        if (response.rows.length !== 1) {
            throw Error("Unable to update user")
        }
        return new UserInfo(response.rows[0]) 
    }

    async destroy() {
        const response = await db.query("DELETE FROM userinfo WHERE userid = $1;", [this.userid])
    }
}

module.exports = User;