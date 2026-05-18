// backend/models/feedbackModel.js
const FeedbackDAO = require('../dao/feedbackDAO');

const getAllFeedback                   = ()                 => FeedbackDAO.findAll();
const getFeedbackByEstablishment      = (establishment_id) => FeedbackDAO.findByEstablishment(establishment_id);
const getFeedbackByRating             = (rating)           => FeedbackDAO.findByRating(rating);
const countTotalFeedback              = ()                 => FeedbackDAO.countAll();
const getFeedbackDistribution         = ()                 => FeedbackDAO.getDistribution();
const getFeedbackCountByEstablishment = ()                 => FeedbackDAO.getCountByEstablishment();
const createFeedback                  = (data)             => FeedbackDAO.insert(data);
const deleteFeedback                  = (id)               => FeedbackDAO.deleteById(id);

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