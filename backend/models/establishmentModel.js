// backend/models/establishmentModel.js
const EstablishmentDAO = require('../dao/establishmentDAO');

const getAllEstablishments      = ()           => EstablishmentDAO.findAll();
const getEstablishmentById      = (id)         => EstablishmentDAO.findById(id);
const getEstablishmentsByStatus = (status)     => EstablishmentDAO.findByStatus(status);
const countAllEstablishments    = ()           => EstablishmentDAO.countAll();
const countByStatus             = ()           => EstablishmentDAO.countsByStatus();
const createEstablishment       = (data)       => EstablishmentDAO.insert(data);
const updateEstablishment       = (id, data)   => EstablishmentDAO.update(id, data);
const updateEstablishmentStatus = (id, status) => EstablishmentDAO.updateStatus(id, status);
const updateEstablishmentRating = (id)         => EstablishmentDAO.recalculateRating(id);
const deleteEstablishment       = (id)         => EstablishmentDAO.deleteById(id);

module.exports = {
    getAllEstablishments,
    getEstablishmentById,
    getEstablishmentsByStatus,
    countAllEstablishments,
    countByStatus,
    createEstablishment,
    updateEstablishment,
    updateEstablishmentStatus,
    updateEstablishmentRating,
    deleteEstablishment,
};