// backend/serviceImplementation/establishmentServiceImpl.js
// Service Implementation — business logic for establishments.

const EstablishmentDAO   = require('../dao/establishmentDAO');
const EstablishmentModel = require('../models/establishmentModel');
const { encrypt, decrypt } = require('../utils/encryption');

const decryptRow = (row) => {
    const m = new EstablishmentModel(row);
    m.setName(row.name             ? decrypt(row.name)             : null);
    m.setType(row.type             ? decrypt(row.type)             : null);
    m.setOwnerName(row.owner_name  ? decrypt(row.owner_name)       : null);
    m.setAddress(row.address       ? decrypt(row.address)          : null);
    m.setDescription(row.description? decrypt(row.description)    : null);
    m.setLatitude(row.latitude     ? decrypt(row.latitude)         : null);
    m.setLongitude(row.longitude   ? decrypt(row.longitude)        : null);
    return {
        id: m.getId(), name: m.getName(), type: m.getType(),
        owner: m.getOwnerName(), address: m.getAddress(),
        description: m.getDescription(), latitude: m.getLatitude(),
        longitude: m.getLongitude(), accreditation: m.getAccreditation(),
        status: m.getStatus(), rating: m.getRating(),
        submitted: m.getSubmittedAt(), created_at: m.getCreatedAt(),
        user_id: m.getUserId(),
    };
};

class EstablishmentServiceImpl {

    async getAll() {
        const [rows, counts] = await Promise.all([
            EstablishmentDAO.findAll(),
            EstablishmentDAO.countsByStatus(),
        ]);
        return {
            establishments: rows.map(decryptRow),
            stats: {
                total:    parseInt(counts.total)            || 0,
                approved: parseInt(counts.approved)         || 0,
                pending:  parseInt(counts.pending)          || 0,
                new:      parseInt(counts.new_registrations)|| 0,
            },
        };
    }

    async getById(id) {
        const row = await EstablishmentDAO.findById(id);
        return row ? decryptRow(row) : null;
    }

    async create(data, userId) {
        const m = new EstablishmentModel({
            user_id:       userId,
            name:          encrypt(data.name),
            type:          encrypt(data.type),
            owner_name:    encrypt(data.owner_name),
            address:       data.address     ? encrypt(data.address)           : null,
            description:   data.description ? encrypt(data.description)       : null,
            latitude:      data.latitude    ? encrypt(String(data.latitude))  : null,
            longitude:     data.longitude   ? encrypt(String(data.longitude)) : null,
            accreditation: data.accreditation || 'None',
        });
        const saved = await EstablishmentDAO.insert(m.toPlainObject());
        return decryptRow(saved);
    }

    async update(id, data) {
        const existing = await EstablishmentDAO.findById(id);
        if (!existing) throw new Error('Establishment not found.');
        const updated = await EstablishmentDAO.update(id, {
            name:          data.name        ? encrypt(data.name)              : existing.name,
            type:          data.type        ? encrypt(data.type)              : existing.type,
            owner_name:    data.owner_name  ? encrypt(data.owner_name)        : existing.owner_name,
            address:       data.address     ? encrypt(data.address)           : existing.address,
            description:   data.description ? encrypt(data.description)       : existing.description,
            latitude:      data.latitude    ? encrypt(String(data.latitude))  : existing.latitude,
            longitude:     data.longitude   ? encrypt(String(data.longitude)) : existing.longitude,
            accreditation: data.accreditation ?? existing.accreditation,
        });
        return decryptRow(updated);
    }

    async updateStatus(id, status) {
        const allowed = ['Approved', 'Pending', 'New'];
        if (!allowed.includes(status)) throw new Error(`Invalid status.`);
        return EstablishmentDAO.updateStatus(id, status);
    }

    async delete(id) {
        const existing = await EstablishmentDAO.findById(id);
        if (!existing) throw new Error('Establishment not found.');
        await EstablishmentDAO.deleteById(id);
    }

    async getApprovedPublic(limit = 5) {
        const rows = await EstablishmentDAO.findApprovedWithImage(limit);
        return rows.map((row) => ({
            id:            row.id,
            name:          row.name       ? decrypt(row.name)       : null,
            type:          row.type       ? decrypt(row.type)       : null,
            owner:         row.owner_name ? decrypt(row.owner_name) : null,
            address:       row.address    ? decrypt(row.address)    : null,
            accreditation: row.accreditation,
            rating:        row.rating,
            primaryImage:  row.primary_image ?? null,
        }));
    }
}

module.exports = new EstablishmentServiceImpl();