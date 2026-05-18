// backend/routes/usersManagementRoutes.js

const express = require('express');
const router  = express.Router();
const {
    getAllUsers,
    getUserById,
    updateStatus,
    deleteUser,
} = require('../controllers/usersManagementController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// All routes require a valid JWT
router.use(verifyToken);

// GET    /api/users-management         → all users + summary (admin, lgu)
router.get('/',
    requireRole('admin', 'lgu'),
    getAllUsers
);

// GET    /api/users-management/:id     → single user (admin, lgu)
router.get('/:id',
    requireRole('admin', 'lgu'),
    getUserById
);

// PATCH  /api/users-management/:id/status → update status (admin only)
router.patch('/:id/status',
    requireRole('admin'),
    updateStatus
);

// DELETE /api/users-management/:id    → delete user (admin only)
router.delete('/:id',
    requireRole('admin'),
    deleteUser
);

module.exports = router;