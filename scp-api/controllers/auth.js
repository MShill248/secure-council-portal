const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const otpStore = {};

async function register(req, res) {
    try {
        const data = req.body;
        console.log(data);
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
        data["password"] = await bcrypt.hash(data.password, salt);
        const result = await User.create(data);
        res.status(201).send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const data = req.body;
        const user = await User.getOneByUsername(data.username);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        if (user.user_role.toLowerCase() == 'developer') {
            // Bypass MFA for developer accounts
            const payload = { username: user.username, user_id: user.user_id };
            jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 3600 }, (err, token) => {
                if (err)return res.status(500).json({ error: 'Error in token generation' });
                res.status(200).json({ success: true, token, user_id: user.user_id, user_role: user.user_role});
            });
        } else {
            const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
            otpStore[user.username] = {
                otp,
                expires: Date.now() + 5 * 60 * 1000 // 5 minutes
            };
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Your SCP OTP',
                text: `Your OTP is: ${otp}`
            });
            res.status(200).json({ success: true, message: 'OTP sent to email.', username: user.username });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function verifyOtp(req, res) {
    try {
        const data = req.body;
        const user = await User.getOneByUsername(data.username);
        const record = otpStore[data.username];
        if (!record) {
            return res.status(400).json({ error: 'No OTP requested for this user' });
        }
        if (Date.now() > record.expires) {
            delete otpStore[data.username];
            return res.status(400).json({ error: 'OTP expired' });
        }
        if (record.otp !== data.otp) {
            return res.status(401).json({ error: 'Invalid OTP' });
        }
        const payload = { username: user.username, userId: user.user_id };
        jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 3600 }, (err, token) => {
            if (err) {
                return res.status(500).json({ error: 'Error in token generation' });
            }
            delete otpStore[data.username];
            res.status(200).json({ success: true, token, user_id: user.user_id, user_role: user.user_role});
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// snedOtp for resetting password
async function sendOtp(req, res) {
    try {
        const { username } = req.body

        if (!username) {
            return res.status(400).json({ error: "Username is required" })
        }

        const user = await User.getOneByUsername(username)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        otpStore[user.username] = {
            otp,
            expires: Date.now() + 5 * 60 * 1000
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: { rejectUnauthorized: false }
        })

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Your SCP OTP for password reset',
            text: `Your OTP for password reset is: ${otp}. This will expire in 5 minutes.`
        })

        res.status(200).json({ success: true, message: 'OTP sent to email.', username: user.username })
    } catch (err) {
        res.status(500).json({ error: "Failed to send OTP" })
    }
}

async function verifyPassword(req, res) {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" })
        }

        const user = await User.getOneByUsername(username)
        
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const match = await bcrypt.compare(password, user.password)
        
        if (!match) {
            return res.status(401).json({ error: "Current password incorrect" })
        }

        const payload = { username: user.username, userId: user.user_id }
        const token = jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: "5m" }) // short-term jwt to verify username and password

        res.status(200).json({ success: true, token })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    register,
    login,
    verifyOtp,
    sendOtp,
    verifyPassword
};