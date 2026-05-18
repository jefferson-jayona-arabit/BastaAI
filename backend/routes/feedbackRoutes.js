// backend/routes/feedbackRoutes.js
const express  = require('express');
const router   = express.Router();

const feedbackController       = require('../controllers/feedbackController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

// Accessible by admin, lgu, and establishment roles
const allowedRoles = ['admin', 'lgu', 'establishment'];

router.get('/stats',        requireRole(allowedRoles), feedbackController.getStats);
router.get('/distribution', requireRole(allowedRoles), feedbackController.getDistribution);
router.get('/by-spot',      requireRole(allowedRoles), feedbackController.getBySpot);
router.get('/',             requireRole(allowedRoles), feedbackController.getAll);

module.exports = router;