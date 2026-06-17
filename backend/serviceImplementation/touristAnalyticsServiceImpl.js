// backend/serviceImplementation/touristAnalyticsServiceImpl.js
// Service Implementation — business logic for tourist analytics.

const TouristAnalyticsDAO = require('../dao/touristAnalyticsDAO');
const { decrypt }          = require('../utils/encryption');

class TouristAnalyticsServiceImpl {

    async getStatCards() {
        const [totalUsers, totalVisits, dailyAvg, peakDay] = await Promise.all([
            TouristAnalyticsDAO.countTouristUsers(),
            TouristAnalyticsDAO.countMonthlyVisits(),
            TouristAnalyticsDAO.getDailyAverage(),
            TouristAnalyticsDAO.getPeakDayCount(),
        ]);
        return { totalUsers, totalVisits, dailyAvg, peakDay };
    }

    async getDailyTrend() {
        const rows = await TouristAnalyticsDAO.getDailyVisitTrend();
        return rows.map(row => ({
            label:          row.label,
            uniqueVisitors: parseInt(row.unique_visitors) || 0,
            totalScans:     parseInt(row.total_scans)     || 0,
        }));
    }

    async getTopDestinations(limit = 5) {
        const rows = await TouristAnalyticsDAO.getTopDestinations(limit);
        return rows.map(row => ({
            id:         row.id,
            name:       decrypt(row.name_enc),
            totalScans: parseInt(row.total_scans) || 0,
        }));
    }
}

module.exports = new TouristAnalyticsServiceImpl();