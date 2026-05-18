// backend/routes/establishmentRoutes.js

const express = require('express');
const router  = express.Router();
const {
    getAllEstablishments,
    getEstablishmentById,
    createEstablishment,
    updateEstablishment,
    updateStatus,
    deleteEstablishment,
} = require('../controllers/establishmentController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// All routes require a valid JWT
router.use(verifyToken);

// GET    /api/establishments          → list all + stats
router.get('/',     getAllEstablishments);

// GET    /api/establishments/:id      → single record
router.get('/:id',  getEstablishmentById);

// POST   /api/establishments          → create (admin, lgu, establishment)
router.post('/',
    requireRole('admin', 'lgu', 'establishment'),
    createEstablishment
);

// PUT    /api/establishments/:id      → full update (admin, lgu)
router.put('/:id',
    requireRole('admin', 'lgu'),
    updateEstablishment
);

// PATCH  /api/establishments/:id/status → approve / pending / new (admin, lgu)
router.patch('/:id/status',
    requireRole('admin', 'lgu'),
    updateStatus
);

// DELETE /api/establishments/:id      → delete (admin only)
router.delete('/:id',
    requireRole('admin'),
    deleteEstablishment
);

module.exports = router;