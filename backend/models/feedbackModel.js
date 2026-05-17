// backend/models/feedbackModel.js
//
// Business-logic layer for feedback.
// All SQL is delegated to FeedbackDAO — add validation, transforms,
// or cross-table logic here rather than inline queries.
// ─────────────────────────────────────────────────────────────────

const FeedbackDAO = require('../dao/feedbackDAO');

const getAllFeedback                = ()                  => FeedbackDAO.findAll();
const getFeedbackByEstablishment   = (establishment_id)  => FeedbackDAO.findByEstablishment(establishment_id);
const getFeedbackByRating          = (rating)            => FeedbackDAO.findByRating(rating);
const countTotalFeedback           = ()                  => FeedbackDAO.countAll();
const getFeedbackDistribution      = ()                  => FeedbackDAO.getDistribution();
const getFeedbackCountByEstablishment = ()               => FeedbackDAO.getCountByEstablishment();
const createFeedback               = (data)              => FeedbackDAO.insert(data);
const deleteFeedback               = (id)                => FeedbackDAO.deleteById(id);

module.exports = {
    getAllFeedback,
    getFeedbackByEstablishment,
    getFeedbackByRating,
    countTotalFeedback,
    getFeedbackDistribution,
    getFeedbackCountByEstablishment,
    createFeedback,
    deleteFeedback,
};