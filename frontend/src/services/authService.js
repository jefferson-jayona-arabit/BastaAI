// src/services/authService.js
// All API calls to the backend

const API_URL = 'http://localhost:5000/api/auth';

// =====================
// REGISTER
// =====================
export const registerUser = async (formData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Registration failed.');
    }

    return data;
};

// =====================
// LOGIN
// =====================
export const loginUser = async (formData) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Login failed.');
    }

    return data;
};