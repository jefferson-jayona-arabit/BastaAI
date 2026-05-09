const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'bastaai_secret_key';

// =====================
// REGISTER
// =====================
const register = async (req, res) => {
    const { fullname, email, username, password, role } = req.body;

    // Validate required fields
    if (!fullname || !email || !username || !password || !role) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate role
    const allowedRoles = ['tourist', 'establishment'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be tourist or establishment.' });
    }

    try {
        // Check if email already exists
        const emailCheck = await pool.query(
            'SELECT id FROM users WHERE email = $1', [email]
        );
        if (emailCheck.rows.length > 0) {
            return res.status(409).json({ error: 'Email is already registered.' });
        }

        // Check if username already exists
        const usernameCheck = await pool.query(
            'SELECT id FROM users WHERE username = $1', [username]
        );
        if (usernameCheck.rows.length > 0) {
            return res.status(409).json({ error: 'Username is already taken.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert new user
        const result = await pool.query(
            `INSERT INTO users (fullname, email, username, password, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, fullname, email, username, role, created_at`,
            [fullname, email, username, hashedPassword, role]
        );

        const newUser = result.rows[0];

        return res.status(201).json({
            message: 'Registration successful!',
            user: newUser,
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
    const { username, password, role } = req.body;

    // Validate required fields
    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Username, password, and role are required.' });
    }

    try {
        // Find user by username and role
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND role = $2',
            [username, role]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username, password, or role.' });
        }

        const user = result.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username, password, or role.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                username: user.username,
                role: user.role,
            },
        });

    } catch (err) {
        console.error('Login error:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { register, login };