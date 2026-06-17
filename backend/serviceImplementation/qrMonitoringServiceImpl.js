// backend/serviceImplementation/qrMonitoringServiceImpl.js
// Service Implementation — business logic for QR monitoring.

const QRMonitoringDAO = require('../dao/qrMonitoringDAO');
const { decrypt }      = require('../utils/encryption');

const timeAgo = (date) => {
    if (!date) return null;
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60)    return `${diff} secs ago`;
    if (diff < 3600)  return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
};

class QRMonitoringServiceImpl {

    async getStatCards() {
        const [totalScans, scansToday] = await Promise.all([
            QRMonitoringDAO.countTotalScans(),
            QRMonitoringDAO.countScansToday(),
        ]);
        return { totalScans, scansToday };
    }

    async getTopSpots(limit = 7) {
        const rows = await QRMonitoringDAO.getTopSpots(limit);
        return rows.map(row => ({
            id:          row.id,
            name:        decrypt(row.name_enc),
            totalScans:  parseInt(row.total_scans) || 0,
            lastScanAt:  row.last_scan_at,
            lastScanAgo: timeAgo(row.last_scan_at),
        }));
    }

    async getStatusList() {
        const rows = await QRMonitoringDAO.getStatusList();
        return rows.map(row => ({
            id:          row.id,
            name:        decrypt(row.name_enc),
            totalScans:  parseInt(row.total_scans) || 0,
            lastScanAt:  row.last_scan_at,
            lastScanAgo: timeAgo(row.last_scan_at),
            isActive:    row.is_active ?? false,
        }));
    }
}

module.exports = new QRMonitoringServiceImpl();