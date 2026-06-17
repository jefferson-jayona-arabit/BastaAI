// backend/controllers/usersManagementController.js

const usersManagementService = require('../serviceImplementation/usersManagementServiceImpl');

// ── GET /api/users-management ───────────────────────────────────
const getAllUsers = async (req, res) => {
    try {
        const data = await usersManagementService.getAll();  // was getAllUsers
        res.json(data);
    } catch (err) {
        console.error('getAllUsers error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ── GET /api/users-management/:id ──────────────────────────────
const getUserById = async (req, res) => {
    try {
        const user = await usersManagementService.getById(req.params.id);  // was getUserById
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
        const row = await usersManagementService.updateStatus(req.params.id, status);  // was updateUserStatus
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
        const user = await usersManagementService.getById(req.params.id);  // was getUserById
        if (!user) return res.status(404).json({ error: 'User not found.' });

        if (parseInt(req.params.id) === req.user.id) {
            return res.status(403).json({ error: 'You cannot delete your own account.' });
        }

        await usersManagementService.delete(req.params.id);  // was deleteUser
        res.json({ message: 'User deleted successfully.' });
    } catch (err) {
        console.error('deleteUser error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const createUser = async (req, res) => {
    const { fullname, email, password, role } = req.body;
    try {
        const row = await usersManagementService.create({ fullname, email, password, role });
        res.status(201).json({ message: 'User created successfully.', id: row.id });
    } catch (err) {
        const status = err.message.includes('already exists') ? 409
                     : err.message.includes('required') || err.message.includes('Invalid') ? 400
                     : 500;
        res.status(status).json({ error: err.message });
    }
};
const updateUser = async (req, res) => {
    const { fullname, email, role, status } = req.body;
    try {
        const row = await usersManagementService.update(req.params.id, { fullname, email, role, status });
        if (!row) return res.status(404).json({ error: 'User not found.' });
        res.json({ message: 'User updated successfully.', id: row.id });
    } catch (err) {
        const code = err.message.includes('required') || err.message.includes('Invalid') ? 400 : 500;
        res.status(code).json({ error: err.message });
    }
};

module.exports = { getAllUsers, getUserById, updateStatus, deleteUser, createUser, updateUser };