require('dotenv').config();

const express                = require('express');
const cors                   = require('cors');
const path                   = require('path');
const authRoutes             = require('./routes/authRoutes');
const dashboardRoutes        = require('./routes/dashboardRoutes');
const touristAnalyticsRoutes = require('./routes/touristAnalyticsRoutes');
const establishmentRoutes    = require('./routes/establishmentRoutes');
const qrMonitoringRoutes     = require('./routes/qrMonitoringRoutes');
const feedbackRoutes = require("./routes/feedbackRoutes");
const usersManagementRoutes   = require('./routes/usersManagementRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.json({ message: '✅ BASTA AI Backend is running' });
});

app.use('/api/auth',              authRoutes);
app.use('/api/dashboard',         dashboardRoutes);
app.use('/api/tourist-analytics', touristAnalyticsRoutes);
app.use('/api/establishments',    establishmentRoutes);
app.use('/api/qr-monitoring',     qrMonitoringRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use('/api/users-management',  usersManagementRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});