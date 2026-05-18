// backend/controllers/feedbackController.js
const FeedbackModel = require('../models/feedbackModel');

// GET /api/feedback/stats
const getStats = async (req, res) => {
    try {
        const raw = await FeedbackModel.countTotalFeedback();

        const totalFeedback   = parseInt(raw.total_feedback,  10) || 0;
        const avgRating       = parseFloat(raw.avg_rating)        || 0;
        const positiveCount   = parseInt(raw.positive_count,  10) || 0;
        const thisMonthCount  = parseInt(raw.this_month_count, 10) || 0;
        const positivePercent = totalFeedback > 0
            ? Math.round((positiveCount / totalFeedback) * 100)
            : 0;

        res.json({
            success: true,
            data: {
                total_feedback:   totalFeedback,
                avg_rating:       avgRating,
                positive_percent: positivePercent,
                this_month_count: thisMonthCount,
            },
        });
    } catch (err) {
        console.error('[feedbackController.getStats]', err);
        res.status(500).json({ success: false, message: 'Failed to fetch feedback stats.' });
    }
};

// GET /api/feedback/distribution
const getDistribution = async (req, res) => {
    try {
        const raw = await FeedbackModel.getFeedbackDistribution();

        res.json({
            success: true,
            data: {
                five_star:  parseInt(raw.five_star,  10) || 0,
                four_star:  parseInt(raw.four_star,  10) || 0,
                three_star: parseInt(raw.three_star, 10) || 0,
                two_star:   parseInt(raw.two_star,   10) || 0,
                one_star:   parseInt(raw.one_star,   10) || 0,
                total:      parseInt(raw.total,      10) || 0,
            },
        });
    } catch (err) {
        console.error('[feedbackController.getDistribution]', err);
        res.status(500).json({ success: false, message: 'Failed to fetch rating distribution.' });
    }
};

// GET /api/feedback/by-spot
const getBySpot = async (req, res) => {
    try {
        const data = await FeedbackModel.getFeedbackCountByEstablishment();
        res.json({ success: true, data });
    } catch (err) {
        console.error('[feedbackController.getBySpot]', err);
        res.status(500).json({ success: false, message: 'Failed to fetch spot feedback.' });
    }
};

// GET /api/feedback?rating=5
const getAll = async (req, res) => {
    try {
        const { rating } = req.query;

        let data;
        if (rating) {
            const parsed = parseInt(rating, 10);
            if (parsed < 1 || parsed > 5) {
                return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
            }
            data = await FeedbackModel.getFeedbackByRating(parsed);
        } else {
            data = await FeedbackModel.getAllFeedback();
        }

        res.json({ success: true, data });
    } catch (err) {
        console.error('[feedbackController.getAll]', err);
        res.status(500).json({ success: false, message: 'Failed to fetch feedback list.' });
    }
};

module.exports = { getStats, getDistribution, getBySpot, getAll };