// backend/controllers/feedbackController.js
// HTTP layer only — delegates to FeedbackServiceImpl.

const feedbackService = require('../serviceImplementation/feedbackServiceImpl');

const getStats = async (req, res) => {
    try {
        const data = await feedbackService.getStats();
        res.json({ success: true, data });
    } catch (err) {
        console.error('[feedbackController.getStats]', err.message);
        res.status(500).json({ success: false, message: 'Failed to fetch feedback stats.' });
    }
};

const getDistribution = async (req, res) => {
    try {
        const data = await feedbackService.getDistribution();
        res.json({ success: true, data });
    } catch (err) {
        console.error('[feedbackController.getDistribution]', err.message);
        res.status(500).json({ success: false, message: 'Failed to fetch rating distribution.' });
    }
};

const getBySpot = async (req, res) => {
    try {
        const data = await feedbackService.getBySpot();
        res.json({ success: true, data });
    } catch (err) {
        console.error('[feedbackController.getBySpot]', err.message);
        res.status(500).json({ success: false, message: 'Failed to fetch spot feedback.' });
    }
};

const getAll = async (req, res) => {
    try {
        const data = await feedbackService.getAll(req.query.rating || null);
        res.json({ success: true, data });
    } catch (err) {
        console.error('[feedbackController.getAll]', err.message);
        const code = err.message.includes('between') ? 400 : 500;
        res.status(code).json({ success: false, message: err.message });
    }
};

module.exports = { getStats, getDistribution, getBySpot, getAll };