// backend/controllers/establishmentImageController.js
// HTTP layer only — delegates to EstablishmentServiceImpl for existence check.

const path                   = require('path');
const fs                     = require('fs');
const EstablishmentImageDAO  = require('../dao/establishmentImageDAO');
const establishmentService   = require('../serviceImplementation/establishmentServiceImpl');

const toPublicUrl = (filePath) => {
    const rel = filePath.replace(/\\/g, '/');
    const idx  = rel.indexOf('/uploads/');
    return idx !== -1 ? rel.slice(idx) : '/' + rel;
};

const uploadImages = async (req, res) => {
    const { id } = req.params;
    if (!req.files || req.files.length === 0)
        return res.status(400).json({ error: 'No images uploaded.' });
    try {
        const est = await establishmentService.getById(id);
        if (!est) return res.status(404).json({ error: 'Establishment not found.' });

        const existing   = await EstablishmentImageDAO.findByEstablishment(id);
        const hasPrimary = existing.some(img => img.is_primary);
        const images     = req.files.map((file, i) => ({
            image_url:  toPublicUrl(file.path),
            is_primary: !hasPrimary && i === 0,
            sort_order: existing.length + i,
        }));
        const inserted = await EstablishmentImageDAO.insertMany(id, images);
        res.status(201).json({ message: `${inserted.length} image(s) uploaded successfully.`, images: inserted });
    } catch (err) { console.error('uploadImages error:', err.message); res.status(500).json({ error: 'Internal Server Error' }); }
};

const getImages = async (req, res) => {
    try { res.json(await EstablishmentImageDAO.findByEstablishment(req.params.id)); }
    catch (err) { console.error('getImages error:', err.message); res.status(500).json({ error: 'Internal Server Error' }); }
};

const setPrimary = async (req, res) => {
    try {
        const row = await EstablishmentImageDAO.setPrimary(req.params.id, req.params.imageId);
        if (!row) return res.status(404).json({ error: 'Image not found.' });
        res.json({ message: 'Primary image updated.', image: row });
    } catch (err) { console.error('setPrimary error:', err.message); res.status(500).json({ error: 'Internal Server Error' }); }
};

const deleteImage = async (req, res) => {
    try {
        const deleted = await EstablishmentImageDAO.deleteById(req.params.imageId);
        if (!deleted) return res.status(404).json({ error: 'Image not found.' });
        const diskPath = path.join(__dirname, '..', deleted.image_url);
        if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);
        res.json({ message: 'Image deleted.', id: deleted.id });
    } catch (err) { console.error('deleteImage error:', err.message); res.status(500).json({ error: 'Internal Server Error' }); }
};

module.exports = { uploadImages, getImages, setPrimary, deleteImage };