// backend/controllers/establishmentController.js

const establishmentService = require('../serviceImplementation/establishmentServiceImpl');

// ── GET /api/establishments ─────────────────────────────────────
const getAllEstablishments = async (req, res) => {
    try {
        const data = await establishmentService.getAll();
        res.json(data);
    } catch (err) {
        console.error('getAllEstablishments error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── GET /api/establishments/:id ─────────────────────────────────
const getEstablishmentById = async (req, res) => {
    try {
        const row = await establishmentService.getById(req.params.id);
        if (!row) return res.status(404).json({ error: 'Establishment not found.' });
        res.json(row);
    } catch (err) {
        console.error('getEstablishmentById error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── POST /api/establishments ────────────────────────────────────
const createEstablishment = async (req, res) => {
    const { name, type, owner_name, address, description, latitude, longitude, accreditation } = req.body;

    if (!name || !type || !owner_name) {
        return res.status(400).json({ error: 'Name, type, and owner are required.' });
    }

    try {
        const establishment = await establishmentService.create(req.body, req.user.id);
        res.status(201).json({
            message: 'Establishment created successfully.',
            establishment,
        });
    } catch (err) {
        console.error('createEstablishment error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── PUT /api/establishments/:id ─────────────────────────────────
const updateEstablishment = async (req, res) => {
    try {
        const establishment = await establishmentService.update(req.params.id, req.body);
        res.json({
            message: 'Establishment updated successfully.',
            establishment,
        });
    } catch (err) {
        console.error('updateEstablishment error:', err.message);
        const status = err.message === 'Establishment not found.' ? 404 : 500;
        res.status(status).json({ error: err.message });
    }
};

// ── PATCH /api/establishments/:id/status ───────────────────────
const updateStatus = async (req, res) => {
    const { status } = req.body;
    const allowed = ['Approved', 'Pending', 'New'];

    if (!status || !allowed.includes(status)) {
        return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}.` });
    }

    try {
        const row = await establishmentService.updateStatus(req.params.id, status);
        if (!row) return res.status(404).json({ error: 'Establishment not found.' });
        res.json({ message: `Status updated to ${status}.`, id: row.id, status: row.status });
    } catch (err) {
        console.error('updateStatus error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── DELETE /api/establishments/:id ─────────────────────────────
const deleteEstablishment = async (req, res) => {
    try {
        await establishmentService.delete(req.params.id);
        res.json({ message: 'Establishment deleted successfully.' });
    } catch (err) {
        console.error('deleteEstablishment error:', err.message);
        const status = err.message === 'Establishment not found.' ? 404 : 500;
        res.status(status).json({ error: err.message });
    }
};
// ── GET /api/establishments/public?limit=5 ──────────────────────
const getApprovedPublic = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const data  = await establishmentService.getApprovedPublic(limit);
        res.json(data);
    } catch (err) {
        console.error('getApprovedPublic error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllEstablishments,
    getEstablishmentById,
    createEstablishment,
    updateEstablishment,
    updateStatus,
    deleteEstablishment,
    getApprovedPublic,
};