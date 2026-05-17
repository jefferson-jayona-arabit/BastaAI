// backend/models/userModel.js
//
// Business-logic layer for users.
// All SQL is delegated to UserDAO — add validation, transforms,
// or cross-table logic here rather than inline queries.
// ─────────────────────────────────────────────────────────────────

// backend/models/userModel.js
const UserDAO = require('../dao/userDAO');  // ← '../dao/' not './dao/'

const getAllUsers       = ()           => UserDAO.findAll();
const getUsersByRole   = (role)        => UserDAO.findByRole(role);
const getUserById      = (id)          => UserDAO.findById(id);
const countUsersByRole = (role)        => UserDAO.countByRole(role);
const createUser       = (userData)    => UserDAO.insert(userData);
const updateUserStatus = (id, status)  => UserDAO.updateStatus(id, status);
const deleteUser       = (id)          => UserDAO.deleteById(id);

module.exports = {
    getAllUsers,
    getUsersByRole,
    getUserById,
    countUsersByRole,
    createUser,
    updateUserStatus,
    deleteUser,
};