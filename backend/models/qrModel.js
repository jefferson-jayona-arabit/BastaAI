// backend/models/qrModel.js
//
// Business-logic layer for QR codes and scans.
// All SQL is delegated to QrDAO — add validation, transforms,
// or cross-table logic here rather than inline queries.
// ─────────────────────────────────────────────────────────────────

const QrDAO = require('../dao/qrDAO');

const createQRCode             = (data)              => QrDAO.insertCode(data);
const getQRCodeByEstablishment = (establishment_id)  => QrDAO.findCodeByEstablishment(establishment_id);
const getQRCodeByCode          = (code)              => QrDAO.findCodeByValue(code);
const logScan                  = (data)              => QrDAO.insertScan(data);
const countTotalScans          = ()                  => QrDAO.countAllScans();
const countScansToday          = ()                  => QrDAO.countScansToday();
const getTopSpots              = (limit)             => QrDAO.findTopSpots(limit);
const getDailyVisits           = ()                  => QrDAO.findDailyVisitsThisMonth();

module.exports = {
    createQRCode,
    getQRCodeByEstablishment,
    getQRCodeByCode,
    logScan,
    countTotalScans,
    countScansToday,
    getTopSpots,
    getDailyVisits,
};