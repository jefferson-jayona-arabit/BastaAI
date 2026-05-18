// backend/controllers/establishmentImageController.js
//
// Handles image upload, listing, set-primary, and delete
// for establishment images.
// ─────────────────────────────────────────────────────────────────

const path                  = require('path');
const fs                    = require('fs');
const EstablishmentImageDAO = require('../dao/establishmentImageDAO');
const establishmentModel    = require('../models/establishmentModel');

// ── Helpers ─────────────────────────────────────────────────────
const toPublicUrl = (filePath) => {
    // Convert absolute disk path → URL path served by Express static
    // e.g. /abs/path/uploads/establishments/3/img.jpg
    //   →  /uploads/establishments/3/img.jpg
    const rel = filePath.replace(/\\/g, '/');
    const idx  = rel.indexOf('/uploads/');
    return idx !== -1 ? rel.slice(idx) : '/' + rel;
};

// ── POST /api/establishments/:id/images ─────────────────────────
// Upload 1–10 images for an establishment
const uploadImages = async (req, res) => {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No images uploaded.' });
    }

    try {
        // Verify establishment exists
        const est = await establishmentModel.getEstablishmentById(id);
        if (!est) return res.status(404).json({ error: 'Establishment not found.' });

        // Check if any primary already exists
        const existing = await EstablishmentImageDAO.findByEstablishment(id);
        const hasPrimary = existing.some(img => img.is_primary);

        const images = req.files.map((file, i) => ({
            image_url:  toPublicUrl(file.path),
            is_primary: !hasPrimary && i === 0,  // first upload = primary if none exists
            sort_order: existing.length + i,
        }));

        const inserted = await EstablishmentImageDAO.insertMany(id, images);

        res.status(201).json({
            message: `${inserted.length} image(s) uploaded successfully.`,
            images: inserted,
        });

    } catch (err) {
        console.error('uploadImages error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── GET /api/establishments/:id/images ──────────────────────────
const getImages = async (req, res) => {
    try {
        const images = await EstablishmentImageDAO.findByEstablishment(req.params.id);
        res.json(images);
    } catch (err) {
        console.error('getImages error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── PATCH /api/establishments/:id/images/:imageId/primary ───────
const setPrimary = async (req, res) => {
    try {
        const row = await EstablishmentImageDAO.setPrimary(
            req.params.id,
            req.params.imageId
        );
        if (!row) return res.status(404).json({ error: 'Image not found.' });
        res.json({ message: 'Primary image updated.', image: row });
    } catch (err) {
        console.error('setPrimary error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── DELETE /api/establishments/:id/images/:imageId ──────────────
const deleteImage = async (req, res) => {
    try {
        const deleted = await EstablishmentImageDAO.deleteById(req.params.imageId);
        if (!deleted) return res.status(404).json({ error: 'Image not found.' });

        // Remove file from disk
        const diskPath = path.join(__dirname, '..', deleted.image_url);
        if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);

        res.json({ message: 'Image deleted.', id: deleted.id });
    } catch (err) {
        console.error('deleteImage error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { uploadImages, getImages, setPrimary, deleteImage };