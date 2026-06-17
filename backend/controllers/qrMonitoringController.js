
const qrMonitoringService = require('../serviceImplementation/qrMonitoringServiceImpl');



// Then update all method calls:
const getStatCards = async (req, res) => {
    try {
        const data = await qrMonitoringService.getStatCards();
        res.json(data);
    } catch (err) {
        console.error('QR getStatCards error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getTopSpots = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 7;
        const data  = await qrMonitoringService.getTopSpots(limit);
        res.json(data);
    } catch (err) {
        console.error('QR getTopSpots error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getStatusList = async (req, res) => {
    try {
        const data = await qrMonitoringService.getStatusList();
        res.json(data);
    } catch (err) {
        console.error('QR getStatusList error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getStatCards, getTopSpots, getStatusList };