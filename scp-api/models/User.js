const db = require('../database/connect');
const encrypter = require('../encrypt/crypto');
const crypto = require('crypto');

const key = crypto.scryptSync('secretPassword', 'salt', 32);

class User {

    constructor({ user_id,  username, first_name, last_name, email, password, dob, address, postcode, borough, phone_number, user_role}) {
        this.user_id = user_id;
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.dob = dob;
        this.address = address;
        this.postcode = postcode;
        this.borough = borough;
        this.phone_number = phone_number;
        this.user_role = user_role;

    }

    static async getAll() {
        const response = await db.query("SELECT * FROM users;")
        if (response.rows.length === 0) {
            throw Error("No users available")
        }
        // for(let i = 0; i < response.rows.length; i++) {
        //     encrypter.decryptUser(response.rows[i], key)
        // }
        return response.rows.map((user) => new User(user))
    }


    static async getOneById(id) {
        const response = await db.query("SELECT * FROM users WHERE user_id = $1;", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        //encrypter.decryptUser(response.rows[0], key)
        return new User(response.rows[0]);
    }

    static async getOneByUsername(username) {
        const response = await db.query("SELECT * FROM users WHERE username = $1;", [username]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        //encrypter.decryptUser(response.rows[0], key)
        return new User(response.rows[0]);
    }

    static async create(data) {
        const {username, first_name, last_name, email, password, dob, address, postcode, borough, phone_number, user_role} = data;

        // const encryptedData = encrypter.encryptArray([username, first_name, last_name, email, address, postcode, borough])
        const encryptedData = [username, first_name, last_name, email, address, postcode, borough]

        try {
           let response = await db.query("INSERT INTO users (username, first_name, last_name, email, password, dob, address, postcode, borough, phone_number, user_role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING user_id;",
            [encryptedData[0], encryptedData[1], encryptedData[2], encryptedData[3], password, dob, encryptedData[4], encryptedData[5], encryptedData[6], phone_number, user_role]);
            
            if (response.rows.length != 1) {
                throw new Error("Unable to create user.");
            }
            
            const newId = response.rows[0].user_id;
            const newUser = await User.getOneById(newId);
            return newUser; 
        } catch (err) {
            throw new Error("Unable to create user.")
        }
    }

    async update(data){
        const { user_id, user_role, username, first_name, last_name, email, password, dob, address, postcode, borough, phone_number } = data

        // const encryptedData = encrypter.encryptArray([username, first_name, last_name, email, address, postcode, borough])
        const encryptedData = [username, first_name, last_name, email, address, postcode, borough]

        const response = await db.query("UPDATE users SET username = COALESCE($1, username), first_name = COALESCE($2, first_name), last_name = COALESCE($3, last_name), email = COALESCE($4, email), password = COALESCE($5, password), dob = COALESCE($6, dob), address = COALESCE($7, address), postcode = COALESCE($8, postcode), borough = COALESCE($9, borough), phone_number = COALESCE($10, phone_number), user_role = COALESCE($11, user_role) WHERE user_id = $12 RETURNING *;", [encryptedData[0], encryptedData[1], encryptedData[2], encryptedData[3], password, dob, encryptedData[4], encryptedData[5], encryptedData[6], phone_number, user_role, this.user_id])
        if (response.rows.length !== 1) {
            throw Error("Unable to update user")
        }
        return new User(response.rows[0]) 
    }

    async destroy() {
        const response = await db.query("DELETE FROM users WHERE user_id = $1;", [this.user_id])
    }
}

module.exports = User;