// backend/routes/dashboardRoutes.js
const express = require('express');
const router  = express.Router();
const {
    getDashboardStats,
    getDailyVisits,
    getEstablishmentSubmissions,
    getMostVisitedSpots,
    getFeedbackDistribution,
} = require('../controllers/dashboardController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// All dashboard routes require a valid JWT token
router.use(verifyToken);

// GET /api/dashboard/stats
router.get('/stats',         getDashboardStats);

// GET /api/dashboard/daily-visits
router.get('/daily-visits',  getDailyVisits);

// GET /api/dashboard/submissions
router.get('/submissions',   getEstablishmentSubmissions);

// GET /api/dashboard/top-spots
router.get('/top-spots',     getMostVisitedSpots);

// GET /api/dashboard/feedback
router.get('/feedback',      getFeedbackDistribution);

module.exports = router;