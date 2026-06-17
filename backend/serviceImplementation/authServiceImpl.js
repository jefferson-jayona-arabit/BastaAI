// backend/serviceImplementation/authServiceImpl.js
//
// Service Implementation — business logic for auth.
// Mirrors Java AdminServiceImpl pattern.
// DAO handles SQL, Model holds data, this layer handles logic.
// ─────────────────────────────────────────────────────────────────

const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');
const UserDAO   = require('../dao/userDAO');
const UserModel = require('../models/userModel');
const { encrypt, decrypt } = require('../utils/encryption');

const SALT_ROUNDS = 10;
const JWT_SECRET  = process.env.JWT_SECRET || 'bastaai_secret_key';

class AuthServiceImpl {

    // ── REGISTER ─────────────────────────────────────────────────
    async register({ fullname, email, password, role }) {
        if (!fullname || !email || !password || !role) {
            throw new Error('All fields are required.');
        }

        const allowedRoles = ['tourist', 'establishment', 'lgu'];
        if (!allowedRoles.includes(role)) {
            throw new Error('Invalid role.');
        }

        // Check duplicate email by decrypting all stored emails
        const existingRows = await UserDAO.findAll();
        const emailExists  = existingRows.some(row => decrypt(row.email) === email);
        if (emailExists) {
            throw new Error('Email is already registered.');
        }

        // Encrypt sensitive fields + hash password
        const model = new UserModel({
            fullname: encrypt(fullname),
            email:    encrypt(email),
            password: await bcrypt.hash(password, SALT_ROUNDS),
            role,
        });

        const saved = await UserDAO.insert(model.toPlainObject());

        // Return decrypted user data
        const result = new UserModel(saved);
        result.setFullname(decrypt(saved.fullname));
        result.setEmail(decrypt(saved.email));

        return result;
    }

    // ── LOGIN ────────────────────────────────────────────────────
    async login({ email, password, role }) {
        if (!email || !password || !role) {
            throw new Error('Email, password, and role are required.');
        }

        // Fetch all users with matching role then find by decrypted email
        const rows = await UserDAO.findByRole(role);
        const row  = rows.find(r => decrypt(r.email) === email);

        if (!row) {
            throw new Error('Invalid email, password, or role.');
        }

        const isMatch = await bcrypt.compare(password, row.password);
        if (!isMatch) {
            throw new Error('Invalid email, password, or role.');
        }

        // Build model
        const user = new UserModel(row);
        user.setFullname(decrypt(row.fullname));
        user.setEmail(decrypt(row.email));

        // Generate JWT
        const token = jwt.sign(
            { id: user.getId(), email: user.getEmail(), role: user.getRole() },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        return { token, user };
    }
}

module.exports = new AuthServiceImpl();