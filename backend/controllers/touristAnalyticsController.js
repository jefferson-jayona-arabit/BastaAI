// backend/controllers/touristAnalyticsController.js
//
// Handles HTTP requests for the Tourist Analytics page.
// Business logic and DB queries are delegated to the model layer.
// ─────────────────────────────────────────────────────────────────

const touristAnalyticsService = require('../serviceImplementation/touristAnalyticsServiceImpl');

// ── GET /api/tourist-analytics/stats ───────────────────────────
const getStatCards = async (req, res) => {
    try {
        const data = await touristAnalyticsService.getStatCards();
        res.json(data);
    } catch (err) {
        console.error('getStatCards error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── GET /api/tourist-analytics/daily-trend ─────────────────────
const getDailyTrend = async (req, res) => {
    try {
        const data = await touristAnalyticsService.getDailyTrend();
        res.json(data);
    } catch (err) {
        console.error('getDailyTrend error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── GET /api/tourist-analytics/top-destinations ────────────────
const getTopDestinations = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const data  = await touristAnalyticsService.getTopDestinations(limit);
        res.json(data);
    } catch (err) {
        console.error('getTopDestinations error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getStatCards,
    getDailyTrend,
    getTopDestinations,
};