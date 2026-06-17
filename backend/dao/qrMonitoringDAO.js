// backend/dao/qrMonitoringDAO.js
// Data Access Object for QR Code Monitoring — SQL only.

const pool = require('../config/db');

const QRMonitoringDAO = {

    countTotalScans: async () => {
        const { rows } = await pool.query(`SELECT COUNT(*) FROM qr_scans`);
        return parseInt(rows[0].count) || 0;
    },

    countScansToday: async () => {
        const { rows } = await pool.query(
            `SELECT COUNT(*) FROM qr_scans WHERE DATE(scanned_at) = CURRENT_DATE`);
        return parseInt(rows[0].count) || 0;
    },

    getTopSpots: async (limit = 7) => {
        const { rows } = await pool.query(
            `SELECT e.id, e.name AS name_enc, COUNT(qs.id) AS total_scans,
                    MAX(qs.scanned_at) AS last_scan_at
             FROM establishments e
             LEFT JOIN qr_codes qc ON qc.establishment_id = e.id
             LEFT JOIN qr_scans qs ON qs.qr_code_id = qc.id
             GROUP BY e.id, e.name
             ORDER BY total_scans DESC LIMIT $1`, [limit]);
        return rows;
    },

    getStatusList: async () => {
        const { rows } = await pool.query(
            `SELECT e.id, e.name AS name_enc, COUNT(qs.id) AS total_scans,
                    MAX(qs.scanned_at) AS last_scan_at, qc.is_active
             FROM establishments e
             LEFT JOIN qr_codes qc ON qc.establishment_id = e.id
             LEFT JOIN qr_scans qs ON qs.qr_code_id = qc.id
             GROUP BY e.id, e.name, qc.is_active
             ORDER BY last_scan_at DESC NULLS LAST`);
        return rows;
    },

    // ── Used by dashboardServiceImpl ─────────────────────────────
    getDailyVisits: async () => {
        const { rows } = await pool.query(
            `SELECT
                TO_CHAR(DATE(scanned_at), 'Mon DD') AS label,
                COUNT(DISTINCT user_id)             AS unique_visitors,
                COUNT(*)                            AS total_scans
             FROM qr_scans
             WHERE scanned_at >= DATE_TRUNC('month', CURRENT_DATE)
               AND scanned_at <  DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
             GROUP BY DATE(scanned_at)
             ORDER BY DATE(scanned_at)`);
        return rows;
    },
};

module.exports = QRMonitoringDAO;