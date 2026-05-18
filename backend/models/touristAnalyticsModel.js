// backend/models/touristAnalyticsModel.js
//
// Business-logic layer for tourist analytics.
// All SQL is delegated to TouristAnalyticsDAO.
// Transforms, defaults, and cross-table logic go here.
// ─────────────────────────────────────────────────────────────────

const TouristAnalyticsDAO = require('../dao/touristAnalyticsDAO');
const { decrypt }          = require('../utils/encryption');

// ── Summary stat cards ──────────────────────────────────────────
const getStatCards = async () => {
    const [totalUsers, totalVisits, dailyAvg, peakDay] = await Promise.all([
        TouristAnalyticsDAO.countTouristUsers(),
        TouristAnalyticsDAO.countMonthlyVisits(),
        TouristAnalyticsDAO.getDailyAverage(),
        TouristAnalyticsDAO.getPeakDayCount(),
    ]);
    return { totalUsers, totalVisits, dailyAvg, peakDay };
};

// ── Daily visit trend for line chart ───────────────────────────
const getDailyTrend = async () => {
    const rows = await TouristAnalyticsDAO.getDailyVisitTrend();
    return rows.map(row => ({
        label:          row.label,
        uniqueVisitors: parseInt(row.unique_visitors) || 0,
        totalScans:     parseInt(row.total_scans)     || 0,
    }));
};

// ── Top destinations for bar chart (decrypt names) ──────────────
const getTopDestinations = async (limit = 5) => {
    const rows = await TouristAnalyticsDAO.getTopDestinations(limit);
    return rows.map(row => ({
        id:         row.id,
        name:       decrypt(row.name_enc),
        totalScans: parseInt(row.total_scans) || 0,
    }));
};

module.exports = {
    getStatCards,
    getDailyTrend,
    getTopDestinations,
};