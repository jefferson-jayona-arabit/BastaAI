// backend/dao/qrMonitoringDAO.js
//
// Data Access Object for QR Code Monitoring queries.
// Responsible ONLY for executing SQL — no business logic here.
// ─────────────────────────────────────────────────────────────────

const pool = require('../config/db');

const QRMonitoringDAO = {

    // ── Total QR scans (all time) ───────────────────────────────
    countTotalScans: async () => {
        const { rows } = await pool.query(
            `SELECT COUNT(*) FROM qr_scans`
        );
        return parseInt(rows[0].count) || 0;
    },

    // ── Total scans today ───────────────────────────────────────
    countScansToday: async () => {
        const { rows } = await pool.query(
            `SELECT COUNT(*) FROM qr_scans
             WHERE DATE(scanned_at) = CURRENT_DATE`
        );
        return parseInt(rows[0].count) || 0;
    },

    // ── Top spots by cumulative scan count (line chart) ─────────
    getTopSpots: async (limit = 7) => {
        const { rows } = await pool.query(
            `SELECT
                e.id,
                e.name              AS name_enc,
                COUNT(qs.id)        AS total_scans,
                MAX(qs.scanned_at)  AS last_scan_at
             FROM establishments e
             LEFT JOIN qr_codes qc ON qc.establishment_id = e.id
             LEFT JOIN qr_scans qs ON qs.qr_code_id = qc.id
             GROUP BY e.id, e.name
             ORDER BY total_scans DESC
             LIMIT $1`,
            [limit]
        );
        return rows;
    },

    // ── Status list — all establishments with scan info ──────────
    getStatusList: async () => {
        const { rows } = await pool.query(
            `SELECT
                e.id,
                e.name              AS name_enc,
                COUNT(qs.id)        AS total_scans,
                MAX(qs.scanned_at)  AS last_scan_at,
                qc.is_active
             FROM establishments e
             LEFT JOIN qr_codes qc ON qc.establishment_id = e.id
             LEFT JOIN qr_scans qs ON qs.qr_code_id = qc.id
             GROUP BY e.id, e.name, qc.is_active
             ORDER BY last_scan_at DESC NULLS LAST`
        );
        return rows;
    },
};

module.exports = QRMonitoringDAO;