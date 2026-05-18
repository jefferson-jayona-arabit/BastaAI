require('dotenv').config();

const express                = require('express');
const cors                   = require('cors');
const authRoutes             = require('./routes/authRoutes');
const dashboardRoutes        = require('./routes/dashboardRoutes');
const touristAnalyticsRoutes = require('./routes/touristAnalyticsRoutes');
const establishmentRoutes    = require('./routes/establishmentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: '✅ BASTA AI Backend is running' });
});

app.use('/api/auth',               authRoutes);
app.use('/api/dashboard',          dashboardRoutes);
app.use('/api/tourist-analytics',  touristAnalyticsRoutes);
app.use('/api/establishments',     establishmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});