// backend/dao/qrDAO.js
//
// Data Access Object for the `qr_codes` and `qr_scans` tables.
// Responsible ONLY for executing SQL — no business logic here.
// ─────────────────────────────────────────────────────────────────

const pool = require('../config/db');

const QrDAO = {

    // ════════════════════════════════════════════════════════════
    // QR CODES
    // ════════════════════════════════════════════════════════════

    // ── Insert a new QR code row ─────────────────────────────────
    insertCode: async ({ establishment_id, code }) => {
        const { rows } = await pool.query(
            `INSERT INTO qr_codes (establishment_id, code)
             VALUES ($1, $2)
             RETURNING id, establishment_id, code, is_active, created_at`,
            [establishment_id, code]
        );
        return rows[0];
    },

    // ── Find a QR code by its owning establishment ───────────────
    findCodeByEstablishment: async (establishment_id) => {
        const { rows } = await pool.query(
            `SELECT id, establishment_id, code, is_active, created_at
             FROM qr_codes WHERE establishment_id = $1`,
            [establishment_id]
        );
        return rows[0] ?? null;
    },

    // ── Find a QR code by its unique code string ─────────────────
    findCodeByValue: async (code) => {
        const { rows } = await pool.query(
            `SELECT * FROM qr_codes WHERE code = $1`,
            [code]
        );
        return rows[0] ?? null;
    },

    // ════════════════════════════════════════════════════════════
    // QR SCANS
    // ════════════════════════════════════════════════════════════

    // ── Record a single scan event ───────────────────────────────
    insertScan: async ({ qr_code_id, user_id }) => {
        const { rows } = await pool.query(
            `INSERT INTO qr_scans (qr_code_id, user_id)
             VALUES ($1, $2)
             RETURNING id, qr_code_id, user_id, scanned_at`,
            [qr_code_id, user_id]
        );
        return rows[0];
    },

    // ── Return the all-time total scan count ─────────────────────
    countAllScans: async () => {
        const { rows } = await pool.query(
            `SELECT COUNT(*) FROM qr_scans`
        );
        return parseInt(rows[0].count) || 0;
    },

    // ── Return the number of scans that occurred today ───────────
    countScansToday: async () => {
        const { rows } = await pool.query(
            `SELECT COUNT(*) FROM qr_scans
             WHERE DATE(scanned_at) = CURRENT_DATE`
        );
        return parseInt(rows[0].count) || 0;
    },

    // ── Return the top N establishments ranked by scan count ─────
    findTopSpots: async (limit = 8) => {
        const { rows } = await pool.query(
            `SELECT
                e.id,
                e.name               AS name_enc,
                COUNT(qs.id)         AS total_scans,
                MAX(qs.scanned_at)   AS last_scan_at
             FROM establishments e
             LEFT JOIN qr_codes  qc ON qc.establishment_id = e.id
             LEFT JOIN qr_scans  qs ON qs.qr_code_id = qc.id
             GROUP BY e.id, e.name
             ORDER BY total_scans DESC
             LIMIT $1`,
            [limit]
        );
        return rows;
    },

    // ── Return daily visit totals for the current calendar month ─
    findDailyVisitsThisMonth: async () => {
        const { rows } = await pool.query(
            `SELECT
                TO_CHAR(DATE(scanned_at), 'Mon DD') AS label,
                COUNT(DISTINCT user_id)             AS unique_visitors,
                COUNT(*)                            AS total_scans
             FROM qr_scans
             WHERE scanned_at >= DATE_TRUNC('month', CURRENT_DATE)
               AND scanned_at <  DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
             GROUP BY DATE(scanned_at)
             ORDER BY DATE(scanned_at)`
        );
        return rows;
    },
};

module.exports = QrDAO;