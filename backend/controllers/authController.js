// backend/controllers/authController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { encrypt, decrypt } = require('../utils/encryption');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'bastaai_secret_key';

// =====================
// REGISTER
// =====================
const register = async (req, res) => {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const allowedRoles = ['tourist', 'establishment'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be tourist or establishment.' });
    }

    try {
        // Check duplicate email by decrypting all stored emails
        const existingUsers = await pool.query('SELECT email FROM users');
        const emailExists = existingUsers.rows.some(
            (row) => decrypt(row.email) === email
        );

        if (emailExists) {
            return res.status(409).json({ error: 'Email is already registered.' });
        }

        // Encrypt sensitive fields
        const encryptedFullname = encrypt(fullname);
        const encryptedEmail = encrypt(email);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert user
        const result = await pool.query(
            `INSERT INTO users (fullname, email, password, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, fullname, email, role, created_at`,
            [encryptedFullname, encryptedEmail, hashedPassword, role]
        );

        const newUser = result.rows[0];

        return res.status(201).json({
            message: 'Registration successful!',
            user: {
                id: newUser.id,
                fullname: decrypt(newUser.fullname),
                email: decrypt(newUser.email),
                role: newUser.role,
                created_at: newUser.created_at,
            },
        });

    } catch (err) {
        console.error('Register error:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// =====================
// LOGIN
// =====================
const login = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required.' });
    }

    try {
        // Get all users with matching role
        const result = await pool.query(
            'SELECT * FROM users WHERE role = $1', [role]
        );

        // Find by decrypted email
        const user = result.rows.find(
            (row) => decrypt(row.email) === email
        );

        if (!user) {
            return res.status(401).json({ error: 'Invalid email, password, or role.' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email, password, or role.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                fullname: decrypt(user.fullname),
                email: decrypt(user.email),
                role: user.role,
            },
        });

    } catch (err) {
        console.error('Login error:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { register, login };