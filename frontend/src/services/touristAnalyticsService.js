// frontend/src/services/touristAnalyticsService.js

const API_URL = 'http://localhost:5000/api/tourist-analytics';

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed.');
    return data;
};

// GET /api/tourist-analytics/stats
export const fetchTouristStats = async () => {
    const res = await fetch(`${API_URL}/stats`, { headers: authHeaders() });
    return handleResponse(res);
};

// GET /api/tourist-analytics/daily-trend
export const fetchDailyTrend = async () => {
    const res = await fetch(`${API_URL}/daily-trend`, { headers: authHeaders() });
    return handleResponse(res);
};

// GET /api/tourist-analytics/top-destinations?limit=5
export const fetchTopDestinations = async (limit = 5) => {
    const res = await fetch(`${API_URL}/top-destinations?limit=${limit}`, { headers: authHeaders() });
    return handleResponse(res);
};