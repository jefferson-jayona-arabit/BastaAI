// frontend/src/services/qrMonitoringService.js

const API_URL = 'http://localhost:5000/api/qr-monitoring';

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed.');
    return data;
};

// GET /api/qr-monitoring/stats
export const fetchQRStats = async () => {
    const res = await fetch(`${API_URL}/stats`, { headers: authHeaders() });
    return handleResponse(res);
};

// GET /api/qr-monitoring/top-spots?limit=7
export const fetchTopSpots = async (limit = 7) => {
    const res = await fetch(`${API_URL}/top-spots?limit=${limit}`, { headers: authHeaders() });
    return handleResponse(res);
};

// GET /api/qr-monitoring/status-list
export const fetchStatusList = async () => {
    const res = await fetch(`${API_URL}/status-list`, { headers: authHeaders() });
    return handleResponse(res);
};