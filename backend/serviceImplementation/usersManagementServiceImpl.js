// backend/serviceImplementation/usersManagementServiceImpl.js
// Service Implementation — business logic for users management.

const UsersManagementDAO = require('../dao/usersManagementDAO');
const UserModel           = require('../models/userModel');
const { decrypt }         = require('../utils/encryption');
const bcrypt = require('bcrypt');
const { encrypt } = require('../utils/encryption');

const getInitials = (fullname) => {
    if (!fullname) return '??';
    const parts = fullname.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const decryptRow = (row) => {
    const m = new UserModel(row);
    const fullname = row.fullname ? decrypt(row.fullname) : 'Unknown';
    const email    = row.email    ? decrypt(row.email)    : '';
    m.setFullname(fullname);
    m.setEmail(email);
    return {
        id:       m.getId(),
        fullname, email,
        initials: getInitials(fullname),
        role:     m.getRole(),
        status:   m.getStatus(),
        joined:   row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : null,
        visits:   parseInt(row.visit_count) || null,
    };
};

class UsersManagementServiceImpl {

    async getAll() {
        const [rows, roleCounts] = await Promise.all([
            UsersManagementDAO.findAll(),
            UsersManagementDAO.countByRole(),
        ]);
        return {
            users: rows.map(decryptRow),
            summary: {
                total:         parseInt(roleCounts.total)         || 0,
                tourist:       parseInt(roleCounts.tourist)       || 0,
                admin:         parseInt(roleCounts.admin)         || 0,
                lgu:           parseInt(roleCounts.lgu)           || 0,
                establishment: parseInt(roleCounts.establishment) || 0,
            },
        };
    }

    async getById(id) {
        const row = await UsersManagementDAO.findById(id);
        return row ? decryptRow(row) : null;
    }

    async updateStatus(id, status) {
        const allowed = ['active', 'pending', 'suspended'];
        if (!allowed.includes(status)) throw new Error(`Invalid status.`);
        return UsersManagementDAO.updateStatus(id, status);
    }

    async delete(id) {
        await UsersManagementDAO.deleteById(id);
    }

    async create({ fullname, email, password, role }) {
        const ALLOWED_ROLES = ['tourist', 'admin', 'lgu', 'establishment'];
        if (!fullname?.trim())          throw new Error('Full name is required.');
        if (!email?.trim())             throw new Error('Email is required.');
        if (!password || password.length < 8)
                                        throw new Error('Password must be at least 8 characters.');
        if (!ALLOWED_ROLES.includes(role)) throw new Error('Invalid role.');

        const encEmail = encrypt(email.toLowerCase().trim());
        const exists   = await UsersManagementDAO.emailExists(encEmail);
        if (exists) throw new Error('An account with this email already exists.');

        const passwordHash = await bcrypt.hash(password, 12);
        return UsersManagementDAO.createUser({
            fullname: encrypt(fullname.trim()),
            email:    encEmail,
            passwordHash,
            role,
            status: 'active',
        });
    }
    async update(id, { fullname, email, role, status }) {
        const ALLOWED_ROLES   = ['tourist', 'admin', 'lgu', 'establishment'];
        const ALLOWED_STATUSES = ['active', 'pending', 'suspended'];

        if (!fullname?.trim())              throw new Error('Full name is required.');
        if (!email?.trim())                 throw new Error('Email is required.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
                                            throw new Error('Invalid email address.');
        if (!ALLOWED_ROLES.includes(role))   throw new Error('Invalid role.');
        if (!ALLOWED_STATUSES.includes(status)) throw new Error('Invalid status.');

        const encFullname = encrypt(fullname.trim());
        const encEmail    = encrypt(email.toLowerCase().trim());

        return UsersManagementDAO.updateUser(id, {
            fullname: encFullname,
            email:    encEmail,
            role,
            status,
        });
    }
}

module.exports = new UsersManagementServiceImpl();