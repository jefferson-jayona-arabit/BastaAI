// backend/models/usersManagementModel.js
//
// Business-logic layer for Users Management.
// All SQL is delegated to UsersManagementDAO.
// Decryption and transforms happen here.
// ─────────────────────────────────────────────────────────────────

const UsersManagementDAO = require('../dao/usersManagementDAO');
const { decrypt }         = require('../utils/encryption');

// ── Get initials from decrypted fullname ────────────────────────
const getInitials = (fullname) => {
    if (!fullname) return '??';
    const parts = fullname.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ── Decrypt a single user row ───────────────────────────────────
const decryptUser = (row) => {
    const fullname = row.fullname ? decrypt(row.fullname) : 'Unknown';
    const email    = row.email    ? decrypt(row.email)    : '';
    return {
        id:         row.id,
        fullname,
        email,
        initials:   getInitials(fullname),
        role:       row.role,
        status:     row.status,
        joined:     row.created_at
            ? new Date(row.created_at).toISOString().split('T')[0]
            : null,
        visits:     parseInt(row.visit_count) || null,
    };
};

// ── Get all users (decrypted) + summary counts ──────────────────
const getAllUsers = async () => {
    const [rows, roleCounts] = await Promise.all([
        UsersManagementDAO.findAll(),
        UsersManagementDAO.countByRole(),
    ]);

    return {
        users: rows.map(decryptUser),
        summary: {
            total:         parseInt(roleCounts.total)         || 0,
            tourist:       parseInt(roleCounts.tourist)       || 0,
            admin:         parseInt(roleCounts.admin)         || 0,
            lgu:           parseInt(roleCounts.lgu)           || 0,
            establishment: parseInt(roleCounts.establishment) || 0,
        },
    };
};

// ── Get single user (decrypted) ─────────────────────────────────
const getUserById = async (id) => {
    const row = await UsersManagementDAO.findById(id);
    return row ? decryptUser(row) : null;
};

// ── Update user status ──────────────────────────────────────────
const updateUserStatus = async (id, status) => {
    return UsersManagementDAO.updateStatus(id, status);
};

// ── Delete user ─────────────────────────────────────────────────
const deleteUser = async (id) => {
    return UsersManagementDAO.deleteById(id);
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserStatus,
    deleteUser,
};