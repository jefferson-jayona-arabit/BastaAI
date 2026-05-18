// backend/controllers/establishmentController.js

const establishmentModel = require('../models/establishmentModel');
const { encrypt, decrypt } = require('../utils/encryption');

// Matches the DB CHECK constraint exactly:
// CHECK (accreditation IN ('Primary', 'Secondary', 'None'))
const ALLOWED_ACCREDITATIONS = ['None', 'Primary', 'Secondary'];

// ── Decrypt helper for a single establishment row ───────────────
const decryptRow = (row) => ({
    id:            row.id,
    name:          row.name        ? decrypt(row.name)        : null,
    type:          row.type        ? decrypt(row.type)        : null,
    owner:         row.owner_name  ? decrypt(row.owner_name)  : null,
    address:       row.address     ? decrypt(row.address)     : null,
    description:   row.description ? decrypt(row.description) : null,
    latitude:      row.latitude    ? decrypt(row.latitude)    : null,
    longitude:     row.longitude   ? decrypt(row.longitude)   : null,
    accreditation: row.accreditation,
    status:        row.status,
    rating:        row.rating      ? parseFloat(row.rating)   : null,
    submitted:     row.submitted_at,
    created_at:    row.created_at,
    user_id:       row.user_id,
});

// ── GET /api/establishments ─────────────────────────────────────
const getAllEstablishments = async (req, res) => {
    try {
        const [rows, counts] = await Promise.all([
            establishmentModel.getAllEstablishments(),
            establishmentModel.countByStatus(),
        ]);

        res.json({
            establishments: rows.map(decryptRow),
            stats: {
                total:    parseInt(counts.total)             || 0,
                approved: parseInt(counts.approved)          || 0,
                pending:  parseInt(counts.pending)           || 0,
                new:      parseInt(counts.new_registrations) || 0,
            },
        });
    } catch (err) {
        console.error('getAllEstablishments error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── GET /api/establishments/accreditations ──────────────────────
// Returns allowed values so the frontend dropdown always matches the DB.
const getAccreditationOptions = (_req, res) => {
    res.json({ accreditations: ALLOWED_ACCREDITATIONS });
};

// ── GET /api/establishments/:id ─────────────────────────────────
const getEstablishmentById = async (req, res) => {
    try {
        const row = await establishmentModel.getEstablishmentById(req.params.id);
        if (!row) return res.status(404).json({ error: 'Establishment not found.' });
        res.json(decryptRow(row));
    } catch (err) {
        console.error('getEstablishmentById error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── POST /api/establishments ────────────────────────────────────
const createEstablishment = async (req, res) => {
    const {
        name, type, owner_name, address,
        description, latitude, longitude, accreditation,
    } = req.body;

    if (!name || !type || !owner_name) {
        return res.status(400).json({ error: 'Name, type, and owner are required.' });
    }

    // Fall back to 'None' if frontend sends an unrecognised value
    const safeAccreditation = ALLOWED_ACCREDITATIONS.includes(accreditation)
        ? accreditation
        : 'None';

    try {
        const row = await establishmentModel.createEstablishment({
            user_id:       req.user.id,
            name:          encrypt(name),
            type:          encrypt(type),
            owner_name:    encrypt(owner_name),
            address:       address     ? encrypt(address)           : null,
            description:   description ? encrypt(description)       : null,
            latitude:      latitude    ? encrypt(String(latitude))  : null,
            longitude:     longitude   ? encrypt(String(longitude)) : null,
            accreditation: safeAccreditation,
        });

        res.status(201).json({
            message:       'Establishment created successfully.',
            establishment: decryptRow(row),
        });
    } catch (err) {
        console.error('createEstablishment error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── PUT /api/establishments/:id ─────────────────────────────────
const updateEstablishment = async (req, res) => {
    try {
        const existing = await establishmentModel.getEstablishmentById(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Establishment not found.' });

        const {
            name, type, owner_name, address,
            description, latitude, longitude, accreditation,
        } = req.body;

        const safeAccreditation = ALLOWED_ACCREDITATIONS.includes(accreditation)
            ? accreditation
            : existing.accreditation;

        const row = await establishmentModel.updateEstablishment(req.params.id, {
            name:          name        ? encrypt(name)              : existing.name,
            type:          type        ? encrypt(type)              : existing.type,
            owner_name:    owner_name  ? encrypt(owner_name)        : existing.owner_name,
            address:       address     ? encrypt(address)           : existing.address,
            description:   description ? encrypt(description)       : existing.description,
            latitude:      latitude    ? encrypt(String(latitude))  : existing.latitude,
            longitude:     longitude   ? encrypt(String(longitude)) : existing.longitude,
            accreditation: safeAccreditation,
        });

        res.json({
            message:       'Establishment updated successfully.',
            establishment: decryptRow(row),
        });
    } catch (err) {
        console.error('updateEstablishment error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
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
        const row = await establishmentModel.updateEstablishmentStatus(req.params.id, status);
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
        const existing = await establishmentModel.getEstablishmentById(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Establishment not found.' });

        await establishmentModel.deleteEstablishment(req.params.id);
        res.json({ message: 'Establishment deleted successfully.' });
    } catch (err) {
        console.error('deleteEstablishment error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllEstablishments,
    getAccreditationOptions,
    getEstablishmentById,
    createEstablishment,
    updateEstablishment,
    updateStatus,
    deleteEstablishment,
};