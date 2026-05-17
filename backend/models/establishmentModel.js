// backend/models/establishmentModel.js
//
// Business-logic layer for establishments.
// All SQL is delegated to EstablishmentDAO — add validation,
// transforms, or cross-table logic here rather than inline queries.
// ─────────────────────────────────────────────────────────────────

const EstablishmentDAO = require('../dao/establishmentDAO');

const getAllEstablishments       = ()              => EstablishmentDAO.findAll();
const getEstablishmentById       = (id)            => EstablishmentDAO.findById(id);
const getEstablishmentsByStatus  = (status)        => EstablishmentDAO.findByStatus(status);
const countAllEstablishments     = ()              => EstablishmentDAO.countAll();
const countByStatus              = ()              => EstablishmentDAO.countsByStatus();
const createEstablishment        = (data)          => EstablishmentDAO.insert(data);
const updateEstablishmentStatus  = (id, status)    => EstablishmentDAO.updateStatus(id, status);
const updateEstablishmentRating  = (id)            => EstablishmentDAO.recalculateRating(id);
const deleteEstablishment        = (id)            => EstablishmentDAO.deleteById(id);

module.exports = {
    getAllEstablishments,
    getEstablishmentById,
    getEstablishmentsByStatus,
    countAllEstablishments,
    countByStatus,
    createEstablishment,
    updateEstablishmentStatus,
    updateEstablishmentRating,
    deleteEstablishment,
};