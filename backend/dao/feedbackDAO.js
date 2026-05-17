// backend/dao/feedbackDAO.js
//
// Data Access Object for the `feedback` table.
// Responsible ONLY for executing SQL — no business logic here.
// ─────────────────────────────────────────────────────────────────

const pool = require('../config/db');

const FeedbackDAO = {

    // ── Return every feedback row joined to user + establishment ─
    findAll: async () => {
        const { rows } = await pool.query(
            `SELECT
                f.id, f.user_id, f.establishment_id,
                f.rating, f.comment, f.visit_type, f.created_at,
                u.fullname AS user_fullname_enc,
                e.name     AS establishment_name_enc
             FROM feedback f
             LEFT JOIN users          u ON u.id = f.user_id
             LEFT JOIN establishments e ON e.id = f.establishment_id
             ORDER BY f.created_at DESC`
        );
        return rows;
    },

    // ── Return all feedback for a specific establishment ─────────
    findByEstablishment: async (establishment_id) => {
        const { rows } = await pool.query(
            `SELECT
                f.id, f.user_id, f.rating, f.comment,
                f.visit_type, f.created_at,
                u.fullname AS user_fullname_enc
             FROM feedback f
             LEFT JOIN users u ON u.id = f.user_id
             WHERE f.establishment_id = $1
             ORDER BY f.created_at DESC`,
            [establishment_id]
        );
        return rows;
    },

    // ── Return all feedback that matches a specific star rating ──
    findByRating: async (rating) => {
        const { rows } = await pool.query(
            `SELECT
                f.id, f.user_id, f.establishment_id,
                f.rating, f.comment, f.visit_type, f.created_at,
                u.fullname AS user_fullname_enc,
                e.name     AS establishment_name_enc
             FROM feedback f
             LEFT JOIN users          u ON u.id = f.user_id
             LEFT JOIN establishments e ON e.id = f.establishment_id
             WHERE f.rating = $1
             ORDER BY f.created_at DESC`,
            [rating]
        );
        return rows;
    },

    // ── Return the total number of feedback rows ─────────────────
    countAll: async () => {
        const { rows } = await pool.query(
            `SELECT COUNT(*) FROM feedback`
        );
        return parseInt(rows[0].count) || 0;
    },

    // ── Return aggregate stats used by the donut chart ──────────
    getDistribution: async () => {
        const { rows } = await pool.query(
            `SELECT
                COUNT(*)                                    AS total_reviews,
                ROUND(AVG(rating)::NUMERIC, 1)              AS avg_rating,
                COUNT(*) FILTER (WHERE rating = 5)          AS five_star,
                COUNT(*) FILTER (WHERE rating = 4)          AS four_star,
                COUNT(*) FILTER (WHERE rating = 3)          AS three_star,
                COUNT(*) FILTER (WHERE rating = 2)          AS two_star,
                COUNT(*) FILTER (WHERE rating = 1)          AS one_star,
                COUNT(*) FILTER (WHERE rating >= 4)         AS positive_count
             FROM feedback`
        );
        return rows[0];
    },

    // ── Return per-establishment review counts for a bar chart ───
    getCountByEstablishment: async () => {
        const { rows } = await pool.query(
            `SELECT
                e.id,
                e.name                           AS establishment_name_enc,
                COUNT(f.id)                      AS total_reviews,
                ROUND(AVG(f.rating)::NUMERIC, 1) AS avg_rating
             FROM establishments e
             LEFT JOIN feedback f ON f.establishment_id = e.id
             GROUP BY e.id, e.name
             ORDER BY total_reviews DESC`
        );
        return rows;
    },

    // ── Insert a new feedback row ────────────────────────────────
    insert: async ({ user_id, establishment_id, rating, comment, visit_type }) => {
        const { rows } = await pool.query(
            `INSERT INTO feedback (user_id, establishment_id, rating, comment, visit_type)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, user_id, establishment_id, rating, comment, visit_type, created_at`,
            [user_id, establishment_id, rating, comment ?? null, visit_type ?? 'First Visit']
        );
        return rows[0];
    },

    // ── Permanently remove a feedback row ────────────────────────
    deleteById: async (id) => {
        await pool.query(`DELETE FROM feedback WHERE id = $1`, [id]);
    },
};

module.exports = FeedbackDAO;