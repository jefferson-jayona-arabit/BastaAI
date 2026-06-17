// frontend/src/services/usersManagementService.js

const API_URL = 'http://localhost:5000/api/users-management';

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed.');
    return data;
};

// GET /api/users-management
export const fetchAllUsers = async () => {
    const res = await fetch(API_URL, { headers: authHeaders() });
    return handleResponse(res);
};

// GET /api/users-management/:id
export const fetchUserById = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { headers: authHeaders() });
    return handleResponse(res);
};

// PATCH /api/users-management/:id/status
export const updateUserStatus = async (id, status) => {
    const res = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(res);
};

// DELETE /api/users-management/:id
export const deleteUser = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse(res);
};

// POST /api/users-management
export const createUser = async ({ fullname, email, password, role }) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ fullname, email, password, role }),
    });
    return handleResponse(res);
};

// PUT /api/users-management/:id
export const updateUser = async (id, { fullname, email, role, status }) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ fullname, email, role, status }),
    });
    return handleResponse(res);
};