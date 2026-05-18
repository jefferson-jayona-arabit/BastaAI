// backend/routes/touristAnalyticsRoutes.js

const express = require('express');
const router  = express.Router();
const {
    getStatCards,
    getDailyTrend,
    getTopDestinations,
} = require('../controllers/touristAnalyticsController');
const { verifyToken } = require('../middleware/authMiddleware');

// All routes require a valid JWT
router.use(verifyToken);

// GET /api/tourist-analytics/stats
router.get('/stats',             getStatCards);

// GET /api/tourist-analytics/daily-trend
router.get('/daily-trend',       getDailyTrend);

// GET /api/tourist-analytics/top-destinations?limit=5
router.get('/top-destinations',  getTopDestinations);

module.exports = router;