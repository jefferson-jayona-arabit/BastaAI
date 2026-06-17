// backend/controllers/authController.js
// HTTP layer only — delegates to AuthServiceImpl.

const authService = require('../serviceImplementation/authServiceImpl');

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({
            message: 'Registration successful!',
            user: { id: user.getId(), fullname: user.getFullname(),
                    email: user.getEmail(), role: user.getRole() },
        });
    } catch (err) {
        console.error('Register error:', err.message);
        const status = err.message.includes('already') ? 409 :
                       err.message.includes('required') || err.message.includes('Invalid') ? 400 : 500;
        res.status(status).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { token, user } = await authService.login(req.body);
        res.status(200).json({
            message: 'Login successful!', token,
            user: { id: user.getId(), fullname: user.getFullname(),
                    email: user.getEmail(), role: user.getRole() },
        });
    } catch (err) {
        console.error('Login error:', err.message);
        const status = err.message.includes('Invalid') ? 401 :
                       err.message.includes('required') ? 400 : 500;
        res.status(status).json({ error: err.message });
    }
};

module.exports = { register, login };