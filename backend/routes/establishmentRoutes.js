// backend/routes/establishmentRoutes.js

const express  = require('express');
const router   = express.Router();
const {
    getAllEstablishments,
    getEstablishmentById,
    createEstablishment,
    updateEstablishment,
    updateStatus,
    deleteEstablishment,
} = require('../controllers/establishmentController');
const {
    uploadImages,
    getImages,
    setPrimary,
    deleteImage,
} = require('../controllers/establishmentImageController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(verifyToken);

// ── Establishment CRUD ──────────────────────────────────────────
router.get('/',     getAllEstablishments);
router.get('/:id',  getEstablishmentById);
router.post('/',    requireRole('admin','lgu','establishment'), createEstablishment);
router.put('/:id',  requireRole('admin','lgu'), updateEstablishment);
router.patch('/:id/status', requireRole('admin','lgu'), updateStatus);
router.delete('/:id', requireRole('admin'), deleteEstablishment);

// ── Images ──────────────────────────────────────────────────────
// POST   /api/establishments/:id/images          upload images
router.post('/:id/images',
    requireRole('admin','lgu','establishment'),
    upload.array('images', 10),
    uploadImages
);

// GET    /api/establishments/:id/images          list all images
router.get('/:id/images', getImages);

// PATCH  /api/establishments/:id/images/:imageId/primary
router.patch('/:id/images/:imageId/primary',
    requireRole('admin','lgu'),
    setPrimary
);

// DELETE /api/establishments/:id/images/:imageId
router.delete('/:id/images/:imageId',
    requireRole('admin','lgu'),
    deleteImage
);

module.exports = router;