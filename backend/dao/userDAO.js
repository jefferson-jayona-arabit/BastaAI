// backend/dao/userDAO.js
//
// Data Access Object for the `users` table.
// Responsible ONLY for executing SQL — no business logic here.
// ─────────────────────────────────────────────────────────────────

const pool = require('../config/db');

const UserDAO = {

    // ── Fetch every user row (used for duplicate-email checks) ──
    findAll: async () => {
        const { rows } = await pool.query(
            `SELECT id, fullname, email, role, status, created_at
             FROM users`
        );
        return rows;
    },

    // ── Fetch all users that match a given role ─────────────────
    findByRole: async (role) => {
        const { rows } = await pool.query(
            `SELECT * FROM users WHERE role = $1`,
            [role]
        );
        return rows;
    },

    // ── Fetch a single user by primary key ──────────────────────
    findById: async (id) => {
        const { rows } = await pool.query(
            `SELECT id, fullname, email, role, status, created_at
             FROM users WHERE id = $1`,
            [id]
        );
        return rows[0] ?? null;
    },

    // ── Return the number of users with a given role ────────────
    countByRole: async (role) => {
        const { rows } = await pool.query(
            `SELECT COUNT(*) FROM users WHERE role = $1`,
            [role]
        );
        return parseInt(rows[0].count) || 0;
    },

    // ── Insert a new user row and return the created record ─────
    insert: async ({ fullname, email, password, role }) => {
        const { rows } = await pool.query(
            `INSERT INTO users (fullname, email, password, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, fullname, email, role, status, created_at`,
            [fullname, email, password, role]
        );
        return rows[0];
    },

    // ── Update the status column for a single user ──────────────
    updateStatus: async (id, status) => {
        const { rows } = await pool.query(
            `UPDATE users SET status = $1 WHERE id = $2
             RETURNING id, fullname, email, role, status`,
            [status, id]
        );
        return rows[0] ?? null;
    },

    // ── Permanently remove a user row ───────────────────────────
    deleteById: async (id) => {
        await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    },
};

module.exports = UserDAO;