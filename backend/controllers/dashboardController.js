// backend/controllers/dashboardController.js
const { decrypt }           = require('../utils/encryption');
const userModel             = require('../models/userModel');
const qrModel               = require('../models/qrModel');
const establishmentModel    = require('../models/establishmentModel');
const feedbackModel         = require('../models/feedbackModel');

// ── GET /api/dashboard/stats ────────────────────────────────────
const getDashboardStats = async (req, res) => {
    try {
        const [tourists, qrScans, destinations, establishments, feedback] = await Promise.all([
            userModel.countUsersByRole('tourist'),
            qrModel.countTotalScans(),
            establishmentModel.getEstablishmentsByStatus('Approved'),
            establishmentModel.countAllEstablishments(),
            feedbackModel.countTotalFeedback(),
        ]);

        res.json({
            totalTouristUsers:   tourists,
            totalQRScans:        qrScans,
            touristDestinations: destinations.length,
            totalEstablishments: establishments,
            totalFeedback:       feedback,
        });

    } catch (err) {
        console.error('getDashboardStats error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── GET /api/dashboard/daily-visits ────────────────────────────
const getDailyVisits = async (req, res) => {
    try {
        const rows = await qrModel.getDailyVisits();
        res.json(rows);
    } catch (err) {
        console.error('getDailyVisits error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── GET /api/dashboard/submissions ─────────────────────────────
const getEstablishmentSubmissions = async (req, res) => {
    try {
        const row = await establishmentModel.countByStatus();
        const total    = parseInt(row.total)            || 0;
        const approved = parseInt(row.approved)         || 0;

        res.json({
            pending:          parseInt(row.pending)           || 0,
            approved,
            newRegistrations: parseInt(row.new_registrations) || 0,
            total,
            approvalRate:     total > 0 ? Math.round((approved / total) * 100) : 0,
        });
    } catch (err) {
        console.error('getEstablishmentSubmissions error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── GET /api/dashboard/top-spots ───────────────────────────────
const getMostVisitedSpots = async (req, res) => {
    try {
        const rows  = await qrModel.getTopSpots(8);
        const spots = rows.map(row => ({
            id:         row.id,
            name:       decrypt(row.name_enc),
            totalScans: parseInt(row.total_scans) || 0,
            lastScanAt: row.last_scan_at,
        }));
        res.json(spots);
    } catch (err) {
        console.error('getMostVisitedSpots error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── GET /api/dashboard/feedback ────────────────────────────────
const getFeedbackDistribution = async (req, res) => {
    try {
        const row   = await feedbackModel.getFeedbackDistribution();
        const total = parseInt(row.total_reviews)  || 0;
        const pos   = parseInt(row.positive_count) || 0;

        res.json({
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
        });
    } catch (err) {
        console.error('getFeedbackDistribution error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getDashboardStats,
    getDailyVisits,
    getEstablishmentSubmissions,
    getMostVisitedSpots,
    getFeedbackDistribution,
};