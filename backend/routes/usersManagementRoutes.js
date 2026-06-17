// backend/routes/usersManagementRoutes.js

const express = require('express');
const router  = express.Router();
const {
    getAllUsers,
    getUserById,
    updateStatus,
    deleteUser,
    createUser,
    updateUser,
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

// PATCH /:id/status → status-only update (admin AND lgu)  ← was admin only, that caused the 403
router.patch('/:id/status',
    requireRole('admin', 'lgu'),
    updateStatus
);

// DELETE /api/users-management/:id    → delete user (admin only)
router.delete('/:id',
    requireRole('admin'),
    deleteUser
);

// POST /api/users-management  → create user (admin, lgu)
router.post('/',
    requireRole('admin', 'lgu'),
    createUser
);


// PUT /:id → full update (admin AND lgu)
router.put('/:id',
    requireRole('admin', 'lgu'),
    updateUser
);

module.exports = router;