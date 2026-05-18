// backend/dao/touristAnalyticsDAO.js
//
// Data Access Object for tourist analytics queries.
// Responsible ONLY for executing SQL — no business logic here.
// ─────────────────────────────────────────────────────────────────

const pool = require('../config/db');

const TouristAnalyticsDAO = {

    // ── Total tourist users ─────────────────────────────────────
    countTouristUsers: async () => {
        const { rows } = await pool.query(
            `SELECT COUNT(*) FROM users WHERE role = 'tourist'`
        );
        return parseInt(rows[0].count) || 0;
    },

    // ── Total QR scans for current month ───────────────────────
    countMonthlyVisits: async () => {
        const { rows } = await pool.query(
            `SELECT COUNT(*) FROM qr_scans
             WHERE DATE_TRUNC('month', scanned_at) = DATE_TRUNC('month', CURRENT_DATE)`
        );
        return parseInt(rows[0].count) || 0;
    },

    // ── Daily average scans this month ─────────────────────────
    getDailyAverage: async () => {
        const { rows } = await pool.query(
            `SELECT
                ROUND(COUNT(*) / GREATEST(COUNT(DISTINCT DATE(scanned_at)), 1)::NUMERIC, 0) AS daily_avg
             FROM qr_scans
             WHERE DATE_TRUNC('month', scanned_at) = DATE_TRUNC('month', CURRENT_DATE)`
        );
        return parseInt(rows[0].daily_avg) || 0;
    },

    // ── Peak day (highest scan count in current month) ─────────
    getPeakDayCount: async () => {
        const { rows } = await pool.query(
            `SELECT COUNT(*) AS daily_count
             FROM qr_scans
             WHERE DATE_TRUNC('month', scanned_at) = DATE_TRUNC('month', CURRENT_DATE)
             GROUP BY DATE(scanned_at)
             ORDER BY daily_count DESC
             LIMIT 1`
        );
        return parseInt(rows[0]?.daily_count) || 0;
    },

    // ── Daily visit trend (line chart) ─────────────────────────
    getDailyVisitTrend: async () => {
        const { rows } = await pool.query(
            `SELECT
                TO_CHAR(DATE(scanned_at), 'Mon DD') AS label,
                DATE(scanned_at)                    AS visit_date,
                COUNT(DISTINCT user_id)             AS unique_visitors,
                COUNT(*)                            AS total_scans
             FROM qr_scans
             WHERE DATE_TRUNC('month', scanned_at) = DATE_TRUNC('month', CURRENT_DATE)
             GROUP BY DATE(scanned_at)
             ORDER BY DATE(scanned_at)`
        );
        return rows;
    },

    // ── Top destinations by QR scan count (bar chart) ──────────
    getTopDestinations: async (limit = 5) => {
        const { rows } = await pool.query(
            `SELECT
                e.id,
                e.name          AS name_enc,
                COUNT(qs.id)    AS total_scans
             FROM establishments e
             LEFT JOIN qr_codes  qc ON qc.establishment_id = e.id
             LEFT JOIN qr_scans  qs ON qs.qr_code_id = qc.id
             WHERE DATE_TRUNC('month', qs.scanned_at) = DATE_TRUNC('month', CURRENT_DATE)
                OR qs.id IS NULL
             GROUP BY e.id, e.name
             ORDER BY total_scans DESC
             LIMIT $1`,
            [limit]
        );
        return rows;
    },
};

module.exports = TouristAnalyticsDAO;