// backend/serviceImplementation/feedbackServiceImpl.js
// Service Implementation — business logic for Feedback Monitoring.

const FeedbackDAO = require('../dao/feedbackDAO');

class FeedbackServiceImpl {

    // ── Stat cards ───────────────────────────────────────────────
    async getStats() {
        const raw = await FeedbackDAO.getStats();
        const total    = parseInt(raw.total_feedback,  10) || 0;
        const positive = parseInt(raw.positive_count,  10) || 0;
        return {
            total_feedback:   total,
            avg_rating:       parseFloat(raw.avg_rating) || 0,
            positive_percent: total > 0 ? Math.round((positive / total) * 100) : 0,
            this_month_count: parseInt(raw.this_month_count, 10) || 0,
        };
    }

    // ── Donut chart distribution ─────────────────────────────────
    async getDistribution() {
        const raw = await FeedbackDAO.getDistribution();
        return {
            five_star:  parseInt(raw.five_star,  10) || 0,
            four_star:  parseInt(raw.four_star,  10) || 0,
            three_star: parseInt(raw.three_star, 10) || 0,
            two_star:   parseInt(raw.two_star,   10) || 0,
            one_star:   parseInt(raw.one_star,   10) || 0,
            total:      parseInt(raw.total,      10) || 0,
        };
    }

    // ── Bar chart — count per spot ───────────────────────────────
    async getBySpot() {
        return FeedbackDAO.getCountByEstablishment();
    }

    // ── All reviews, optional rating filter ──────────────────────
    async getAll(rating = null) {
        if (rating !== null) {
            const parsed = parseInt(rating, 10);
            if (parsed < 1 || parsed > 5) throw new Error('Rating must be between 1 and 5.');
            return FeedbackDAO.findByRating(parsed);
        }
        return FeedbackDAO.findAll();
    }
}

module.exports = new FeedbackServiceImpl();