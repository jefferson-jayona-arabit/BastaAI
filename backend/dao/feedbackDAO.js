// backend/dao/feedbackDAO.js
const pool = require('../config/db');
const { decrypt } = require('../utils/encryption');

// ── findAll ───────────────────────────────────────────────────────────────────
// Returns every feedback row, decrypting comment, reviewer name,
// and establishment name.
const findAll = async () => {
    const { rows } = await pool.query(`
        SELECT
            f.id,
            f.rating,
            f.comment        AS comment_enc,
            f.visit_type,
            f.created_at,
            u.fullname       AS fullname_enc,
            e.name           AS establishment_name_enc
        FROM public.feedback f
        LEFT JOIN public.users          u ON u.id = f.user_id
        LEFT JOIN public.establishments e ON e.id = f.establishment_id
        ORDER BY f.created_at DESC;
    `);
    return rows.map(_decryptRow);
};

// ── findByEstablishment ───────────────────────────────────────────────────────
const findByEstablishment = async (establishment_id) => {
    const { rows } = await pool.query(`
        SELECT
            f.id,
            f.rating,
            f.comment        AS comment_enc,
            f.visit_type,
            f.created_at,
            u.fullname       AS fullname_enc,
            e.name           AS establishment_name_enc
        FROM public.feedback f
        LEFT JOIN public.users          u ON u.id = f.user_id
        LEFT JOIN public.establishments e ON e.id = f.establishment_id
        WHERE f.establishment_id = $1
        ORDER BY f.created_at DESC;
    `, [establishment_id]);
    return rows.map(_decryptRow);
};

// ── findByRating ──────────────────────────────────────────────────────────────
const findByRating = async (rating) => {
    const { rows } = await pool.query(`
        SELECT
            f.id,
            f.rating,
            f.comment        AS comment_enc,
            f.visit_type,
            f.created_at,
            u.fullname       AS fullname_enc,
            e.name           AS establishment_name_enc
        FROM public.feedback f
        LEFT JOIN public.users          u ON u.id = f.user_id
        LEFT JOIN public.establishments e ON e.id = f.establishment_id
        WHERE f.rating = $1
        ORDER BY f.created_at DESC;
    `, [rating]);
    return rows.map(_decryptRow);
};

// ── countAll ──────────────────────────────────────────────────────────────────
// Returns aggregate stats used by the stat cards.
const countAll = async () => {
    const { rows } = await pool.query(`
        SELECT
            COUNT(*)                                              AS total_feedback,
            COALESCE(ROUND(AVG(rating)::NUMERIC, 1), 0)          AS avg_rating,
            COUNT(*) FILTER (WHERE rating >= 4)                  AS positive_count,
            COUNT(*) FILTER (
                WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())
            )                                                    AS this_month_count
        FROM public.feedback;
    `);
    return parseInt(rows[0].total_feedback) || 0; 
};

// ── getDistribution ───────────────────────────────────────────────────────────
// Returns per-star counts for the donut chart.
const getDistribution = async () => {
    const { rows } = await pool.query(`
        SELECT
            COUNT(*) FILTER (WHERE rating = 5)  AS five_star,
            COUNT(*) FILTER (WHERE rating = 4)  AS four_star,
            COUNT(*) FILTER (WHERE rating = 3)  AS three_star,
            COUNT(*) FILTER (WHERE rating = 2)  AS two_star,
            COUNT(*) FILTER (WHERE rating = 1)  AS one_star,
            COUNT(*)                            AS total
        FROM public.feedback;
    `);
    return rows[0];
};

// ── getCountByEstablishment ───────────────────────────────────────────────────
// Returns feedback count per establishment for the bar chart (top 10).
const getCountByEstablishment = async () => {
    const { rows } = await pool.query(`
        SELECT
            e.id,
            e.name           AS establishment_name_enc,
            COUNT(f.id)      AS feedback_count
        FROM public.establishments e
        LEFT JOIN public.feedback f ON f.establishment_id = e.id
        GROUP BY e.id, e.name
        ORDER BY feedback_count DESC
        LIMIT 10;
    `);
    return rows.map((row) => ({
        id:    row.id,
        name:  decrypt(row.establishment_name_enc),
        count: parseInt(row.feedback_count, 10),
    }));
};

// ── insert ────────────────────────────────────────────────────────────────────
const insert = async ({ user_id, establishment_id, rating, comment, visit_type }) => {
    const { rows } = await pool.query(`
        INSERT INTO public.feedback (user_id, establishment_id, rating, comment, visit_type)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, rating, visit_type, created_at;
    `, [user_id, establishment_id, rating, comment || null, visit_type || 'First Visit']);
    return rows[0];
};

// ── deleteById ────────────────────────────────────────────────────────────────
const deleteById = async (id) => {
    const { rows } = await pool.query(`
        DELETE FROM public.feedback WHERE id = $1 RETURNING id;
    `, [id]);
    return rows[0];
};

// ── Private helper ────────────────────────────────────────────────────────────
function _decryptRow(row) {
    return {
        id:                 row.id,
        rating:             row.rating,
        comment:            row.comment_enc ? decrypt(row.comment_enc) : null,
        visit_type:         row.visit_type,
        created_at:         row.created_at,
        reviewer_name:      row.fullname_enc ? decrypt(row.fullname_enc) : 'Anonymous',
        establishment_name: row.establishment_name_enc ? decrypt(row.establishment_name_enc) : 'Unknown',
    };
}

module.exports = {
    findAll,
    findByEstablishment,
    findByRating,
    countAll,
    getDistribution,
    getCountByEstablishment,
    insert,
    deleteById,
};