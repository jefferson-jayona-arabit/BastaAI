// backend/controllers/qrMonitoringController.js
//
// Handles HTTP requests for the QR Code Monitoring page.
// Business logic delegated to the model layer.
// ─────────────────────────────────────────────────────────────────

const qrMonitoringModel = require('../models/qrMonitoringModel');

// ── GET /api/qr-monitoring/stats ────────────────────────────────
const getStatCards = async (req, res) => {
    try {
        const data = await qrMonitoringModel.getStatCards();
        res.json(data);
    } catch (err) {
        console.error('QR getStatCards error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── GET /api/qr-monitoring/top-spots?limit=7 ────────────────────
const getTopSpots = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 7;
        const data  = await qrMonitoringModel.getTopSpots(limit);
        res.json(data);
    } catch (err) {
        console.error('QR getTopSpots error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── GET /api/qr-monitoring/status-list ──────────────────────────
const getStatusList = async (req, res) => {
    try {
        const data = await qrMonitoringModel.getStatusList();
        res.json(data);
    } catch (err) {
        console.error('QR getStatusList error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getStatCards, getTopSpots, getStatusList };