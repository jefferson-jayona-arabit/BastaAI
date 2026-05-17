// backend/dao/establishmentDAO.js
//
// Data Access Object for the `establishments` table.
// Responsible ONLY for executing SQL — no business logic here.
// ─────────────────────────────────────────────────────────────────

const pool = require('../config/db');

/** Shared column list to avoid repeating the SELECT projection. */
const BASE_COLUMNS = `
    id, name, type, owner_name, address, description,
    latitude, longitude, accreditation, status,
    rating, submitted_at, created_at, user_id
`;

const EstablishmentDAO = {

    // ── Return every establishment, newest first ─────────────────
    findAll: async () => {
        const { rows } = await pool.query(
            `SELECT ${BASE_COLUMNS}
             FROM establishments
             ORDER BY created_at DESC`
        );
        return rows;
    },

    // ── Return a single establishment by primary key ─────────────
    findById: async (id) => {
        const { rows } = await pool.query(
            `SELECT ${BASE_COLUMNS}
             FROM establishments WHERE id = $1`,
            [id]
        );
        return rows[0] ?? null;
    },

    // ── Return all establishments matching a given status ────────
    findByStatus: async (status) => {
        const { rows } = await pool.query(
            `SELECT id, name, type, owner_name, address, description,
                    latitude, longitude, accreditation, status,
                    rating, submitted_at, created_at
             FROM establishments WHERE status = $1
             ORDER BY submitted_at DESC`,
            [status]
        );
        return rows;
    },

    // ── Return the total row count ───────────────────────────────
    countAll: async () => {
        const { rows } = await pool.query(
            `SELECT COUNT(*) FROM establishments`
        );
        return parseInt(rows[0].count) || 0;
    },

    // ── Return counts broken down by status in one query ─────────
    countsByStatus: async () => {
        const { rows } = await pool.query(
            `SELECT
                COUNT(*) FILTER (WHERE status = 'Approved')  AS approved,
                COUNT(*) FILTER (WHERE status = 'Pending')   AS pending,
                COUNT(*) FILTER (WHERE status = 'New')       AS new_registrations,
                COUNT(*)                                      AS total
             FROM establishments`
        );
        return rows[0];
    },

    // ── Insert a new establishment row ───────────────────────────
    insert: async ({
        user_id, name, type, owner_name,
        address, description, latitude, longitude,
        accreditation,
    }) => {
        const { rows } = await pool.query(
            `INSERT INTO establishments
                (user_id, name, type, owner_name, address, description,
                 latitude, longitude, accreditation)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
             RETURNING *`,
            [
                user_id, name, type, owner_name,
                address, description, latitude, longitude,
                accreditation ?? 'None',
            ]
        );
        return rows[0];
    },

    // ── Update only the status column ────────────────────────────
    updateStatus: async (id, status) => {
        const { rows } = await pool.query(
            `UPDATE establishments SET status = $1 WHERE id = $2
             RETURNING id, status`,
            [status, id]
        );
        return rows[0] ?? null;
    },

    // ── Recompute the average rating from the feedback table ─────
    recalculateRating: async (id) => {
        const { rows } = await pool.query(
            `UPDATE establishments
             SET rating = (
                 SELECT ROUND(AVG(rating)::NUMERIC, 1)
                 FROM feedback WHERE establishment_id = $1
             )
             WHERE id = $1
             RETURNING id, rating`,
            [id]
        );
        return rows[0] ?? null;
    },

    // ── Permanently remove an establishment row ──────────────────
    deleteById: async (id) => {
        await pool.query(
            `DELETE FROM establishments WHERE id = $1`,
            [id]
        );
    },
};

module.exports = EstablishmentDAO;