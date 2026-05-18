// backend/controllers/usersManagementController.js
//
// Handles HTTP requests for the Users Management page.
// Business logic delegated to the model layer.
// ─────────────────────────────────────────────────────────────────

const usersManagementModel = require('../models/usersManagementModel');

// ── GET /api/users-management ───────────────────────────────────
// Returns all users (decrypted) + summary counts
const getAllUsers = async (req, res) => {
    try {
        const data = await usersManagementModel.getAllUsers();
        res.json(data);
    } catch (err) {
        console.error('getAllUsers error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── GET /api/users-management/:id ──────────────────────────────
const getUserById = async (req, res) => {
    try {
        const user = await usersManagementModel.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json(user);
    } catch (err) {
        console.error('getUserById error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── PATCH /api/users-management/:id/status ─────────────────────
const updateStatus = async (req, res) => {
    const { status } = req.body;
    const allowed = ['active', 'pending', 'suspended'];

    if (!status || !allowed.includes(status)) {
        return res.status(400).json({
            error: `Status must be one of: ${allowed.join(', ')}.`
        });
    }

    try {
        const row = await usersManagementModel.updateUserStatus(req.params.id, status);
        if (!row) return res.status(404).json({ error: 'User not found.' });
        res.json({ message: `User status updated to ${status}.`, id: row.id, status: row.status });
    } catch (err) {
        console.error('updateStatus error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── DELETE /api/users-management/:id ───────────────────────────
const deleteUser = async (req, res) => {
    try {
        const user = await usersManagementModel.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        // Prevent deleting yourself
        if (parseInt(req.params.id) === req.user.id) {
            return res.status(403).json({ error: 'You cannot delete your own account.' });
        }

        await usersManagementModel.deleteUser(req.params.id);
        res.json({ message: 'User deleted successfully.' });
    } catch (err) {
        console.error('deleteUser error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllUsers, getUserById, updateStatus, deleteUser };