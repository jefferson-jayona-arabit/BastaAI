// backend/routes/qrMonitoringRoutes.js

const express = require('express');
const router  = express.Router();
const {
    getStatCards,
    getTopSpots,
    getStatusList,
} = require('../controllers/qrMonitoringController');
const { verifyToken } = require('../middleware/authMiddleware');

// All routes require valid JWT
router.use(verifyToken);

// GET /api/qr-monitoring/stats
router.get('/stats',        getStatCards);

// GET /api/qr-monitoring/top-spots?limit=7
router.get('/top-spots',    getTopSpots);

// GET /api/qr-monitoring/status-list
router.get('/status-list',  getStatusList);

module.exports = router;