require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const authRoutes      = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: '✅ BASTA AI Backend is running' });
});

app.use('/api/auth',      authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});