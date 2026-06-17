// backend/controllers/dashboardController.js
// HTTP layer only — delegates to DashboardServiceImpl.

const dashboardService = require('../serviceImplementation/dashboardServiceImpl');

const getDashboardStats           = async (req, res) => { try { res.json(await dashboardService.getStats());               } catch (err) { console.error(err.message); res.status(500).json({ error: 'Internal Server Error' }); } };
const getDailyVisits              = async (req, res) => { try { res.json(await dashboardService.getDailyVisits());          } catch (err) { console.error(err.message); res.status(500).json({ error: 'Internal Server Error' }); } };
const getEstablishmentSubmissions = async (req, res) => { try { res.json(await dashboardService.getSubmissions());          } catch (err) { console.error(err.message); res.status(500).json({ error: 'Internal Server Error' }); } };
const getMostVisitedSpots         = async (req, res) => { try { res.json(await dashboardService.getTopSpots(8));            } catch (err) { console.error(err.message); res.status(500).json({ error: 'Internal Server Error' }); } };
const getFeedbackDistribution     = async (req, res) => { try { res.json(await dashboardService.getFeedbackDistribution()); } catch (err) { console.error(err.message); res.status(500).json({ error: 'Internal Server Error' }); } };

module.exports = { getDashboardStats, getDailyVisits, getEstablishmentSubmissions, getMostVisitedSpots, getFeedbackDistribution };