// frontend/src/services/establishmentService.js

const API_URL = 'http://localhost:5000/api/establishments';

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed.');
    return data;
};

// GET /api/establishments
export const fetchEstablishments = async () => {
    const res = await fetch(API_URL, { headers: authHeaders() });
    return handleResponse(res);
};

// GET /api/establishments/:id
export const fetchEstablishmentById = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { headers: authHeaders() });
    return handleResponse(res);
};

// POST /api/establishments
export const createEstablishment = async (data) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(res);
};

// PUT /api/establishments/:id
export const updateEstablishment = async (id, data) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(res);
};

// PATCH /api/establishments/:id/status
export const updateEstablishmentStatus = async (id, status) => {
    const res = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(res);
};

// DELETE /api/establishments/:id
export const deleteEstablishment = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse(res);
};