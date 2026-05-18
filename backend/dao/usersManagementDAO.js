// backend/dao/usersManagementDAO.js
//
// Data Access Object for Users Management queries.
// Responsible ONLY for executing SQL — no business logic here.
// ─────────────────────────────────────────────────────────────────

const pool = require('../config/db');

const UsersManagementDAO = {

    // ── Fetch all users with visit count joined ──────────────────
    findAll: async () => {
        const { rows } = await pool.query(
            `SELECT
                u.id,
                u.fullname,
                u.email,
                u.role,
                u.status,
                u.created_at,
                COUNT(DISTINCT qs.id) AS visit_count
             FROM users u
             LEFT JOIN qr_scans qs ON qs.user_id = u.id
             GROUP BY u.id
             ORDER BY u.created_at DESC`
        );
        return rows;
    },

    // ── Fetch one user by ID ─────────────────────────────────────
    findById: async (id) => {
        const { rows } = await pool.query(
            `SELECT
                u.id, u.fullname, u.email, u.role,
                u.status, u.created_at,
                COUNT(DISTINCT qs.id) AS visit_count
             FROM users u
             LEFT JOIN qr_scans qs ON qs.user_id = u.id
             WHERE u.id = $1
             GROUP BY u.id`,
            [id]
        );
        return rows[0] ?? null;
    },

    // ── Count users grouped by role ──────────────────────────────
    countByRole: async () => {
        const { rows } = await pool.query(
            `SELECT
                COUNT(*)                                        AS total,
                COUNT(*) FILTER (WHERE role = 'tourist')       AS tourist,
                COUNT(*) FILTER (WHERE role = 'admin')         AS admin,
                COUNT(*) FILTER (WHERE role = 'lgu')           AS lgu,
                COUNT(*) FILTER (WHERE role = 'establishment') AS establishment
             FROM users`
        );
        return rows[0];
    },

    // ── Count users grouped by status ────────────────────────────
    countByStatus: async () => {
        const { rows } = await pool.query(
            `SELECT
                COUNT(*) FILTER (WHERE status = 'active')    AS active,
                COUNT(*) FILTER (WHERE status = 'pending')   AS pending,
                COUNT(*) FILTER (WHERE status = 'suspended') AS suspended
             FROM users`
        );
        return rows[0];
    },

    // ── Update user status ───────────────────────────────────────
    updateStatus: async (id, status) => {
        const { rows } = await pool.query(
            `UPDATE users SET status = $1 WHERE id = $2
             RETURNING id, role, status`,
            [status, id]
        );
        return rows[0] ?? null;
    },

    // ── Delete user ──────────────────────────────────────────────
    deleteById: async (id) => {
        await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    },
};

module.exports = UsersManagementDAO;