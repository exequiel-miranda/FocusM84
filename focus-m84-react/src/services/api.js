const API_URL = 'http://localhost:5000/api';

// Tasks API
export const tasksAPI = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/tasks`);
        if (!response.ok) throw new Error('Error fetching tasks');
        return response.json();
    },

    create: async (task) => {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('Error creating task');
        return response.json();
    },

    update: async (id, task) => {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('Error updating task');
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error deleting task');
        return response.json();
    }
};

// Stats API
export const statsAPI = {
    get: async () => {
        const response = await fetch(`${API_URL}/stats`);
        if (!response.ok) throw new Error('Error fetching stats');
        return response.json();
    },

    update: async (stats) => {
        const response = await fetch(`${API_URL}/stats`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stats)
        });
        if (!response.ok) throw new Error('Error updating stats');
        return response.json();
    }
};

// History API
export const historyAPI = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/history`);
        if (!response.ok) throw new Error('Error fetching history');
        return response.json();
    },

    add: async (entry) => {
        const response = await fetch(`${API_URL}/history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
        });
        if (!response.ok) throw new Error('Error adding history entry');
        return response.json();
    }
};

// Reasons API
export const reasonsAPI = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/reasons`);
        if (!response.ok) throw new Error('Error fetching reasons');
        return response.json();
    },

    add: async (text) => {
        const response = await fetch(`${API_URL}/reasons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Error adding reason');
        }
        return response.json();
    }
};
