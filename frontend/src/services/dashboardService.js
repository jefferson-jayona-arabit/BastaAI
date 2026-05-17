// frontend/src/services/dashboardService.js
const API_URL = 'http://localhost:5000/api/dashboard';

// Helper - attach JWT token to every request
const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed.');
    return data;
};

// GET /api/dashboard/stats
export const fetchDashboardStats = async () => {
    const res = await fetch(`${API_URL}/stats`, { headers: authHeaders() });
    return handleResponse(res);
};

// GET /api/dashboard/daily-visits
export const fetchDailyVisits = async () => {
    const res = await fetch(`${API_URL}/daily-visits`, { headers: authHeaders() });
    return handleResponse(res);
};

// GET /api/dashboard/submissions
export const fetchSubmissions = async () => {
    const res = await fetch(`${API_URL}/submissions`, { headers: authHeaders() });
    return handleResponse(res);
};

// GET /api/dashboard/top-spots
export const fetchTopSpots = async () => {
    const res = await fetch(`${API_URL}/top-spots`, { headers: authHeaders() });
    return handleResponse(res);
};

// GET /api/dashboard/feedback
export const fetchFeedbackDistribution = async () => {
    const res = await fetch(`${API_URL}/feedback`, { headers: authHeaders() });
    return handleResponse(res);
};