// backend/serviceImplementation/dashboardServiceImpl.js
//
// Service Implementation — business logic for the dashboard page.
// ─────────────────────────────────────────────────────────────────

const UserDAO            = require('../dao/userDAO');
const QRMonitoringDAO    = require('../dao/qrMonitoringDAO');
const EstablishmentDAO   = require('../dao/establishmentDAO');
const FeedbackDAO        = require('../dao/feedbackDAO');
const { decrypt }        = require('../utils/encryption');

class DashboardServiceImpl {

    // ── Stat Cards ───────────────────────────────────────────────
    async getStats() {
        const [tourists, qrScans, approvedRows, totalEst, feedback] = await Promise.all([
            UserDAO.countByRole('tourist'),
            QRMonitoringDAO.countTotalScans(),
            EstablishmentDAO.findByStatus('Approved'),
            EstablishmentDAO.countAll(),
            FeedbackDAO.countTotalFeedback(),
        ]);

        return {
            totalTouristUsers:   tourists,
            totalQRScans:        qrScans,
            touristDestinations: approvedRows.length,
            totalEstablishments: totalEst,
            totalFeedback:       feedback,
        };
    }

    // ── Daily Visits (line chart) ────────────────────────────────
    async getDailyVisits() {
        return QRMonitoringDAO.getDailyVisits();
    }

    // ── Establishment Submissions ────────────────────────────────
    async getSubmissions() {
        const row      = await EstablishmentDAO.countsByStatus();
        const total    = parseInt(row.total)    || 0;
        const approved = parseInt(row.approved) || 0;

        return {
            pending:          parseInt(row.pending)           || 0,
            approved,
            newRegistrations: parseInt(row.new_registrations) || 0,
            total,
            approvalRate:     total > 0 ? Math.round((approved / total) * 100) : 0,
        };
    }

    // ── Top Spots (bar chart) ────────────────────────────────────
    async getTopSpots(limit = 8) {
        const rows = await QRMonitoringDAO.getTopSpots(limit);
        return rows.map(row => ({
            id:         row.id,
            name:       decrypt(row.name_enc),
            totalScans: parseInt(row.total_scans) || 0,
            lastScanAt: row.last_scan_at,
        }));
    }

    // ── Feedback Distribution (donut chart) ──────────────────────
    async getFeedbackDistribution() {
        const row   = await FeedbackDAO.getFeedbackDistribution();
        const total = parseInt(row.total_reviews)  || 0;
        const pos   = parseInt(row.positive_count) || 0;

        return {
            totalReviews: total,
            avgRating:    parseFloat(row.avg_rating) || 0,
            positiveRate: total > 0 ? Math.round((pos / total) * 100) : 0,
            distribution: {
                fiveStar:  parseInt(row.five_star)  || 0,
                fourStar:  parseInt(row.four_star)  || 0,
                threeStar: parseInt(row.three_star) || 0,
                twoStar:   parseInt(row.two_star)   || 0,
                oneStar:   parseInt(row.one_star)   || 0,
            },
        };
    }
}

module.exports = new DashboardServiceImpl();