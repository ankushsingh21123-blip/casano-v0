// API Abstraction layer to replace direct Supabase calls
// This hooks into the Express backend defined by VITE_API_BASE_URL

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') : 'http://localhost:8080';

import { io } from 'socket.io-client';
import { supabase } from './supabase';

export const socket = io(SOCKET_URL, {
    autoConnect: false // We will connect manually when user logs in or components mount
});

// Reusable fetch wrapper that can eventually attach JWT tokens
async function fetchAPI(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // If using Supabase/Firebase Auth, you could grab the session token here and inject it:
    const session = await supabase.auth.getSession();
    if (session?.data?.session?.access_token) {
       headers['Authorization'] = `Bearer ${session.data.session.access_token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    return response.json();
}

/**
 * Standard HTTP actions mapping out what the old supabase.from() did
 */

export const vendorsApi = {
    getAllOpen: async () => {
        return fetchAPI('/vendors');
    },
    create: async (payload) => {
        return fetchAPI('/vendors', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },
    getProfile: async (profileId) => {
        return fetchAPI(`/vendors/profile/${profileId}`);
    },
    get: async (vendorId) => {
        return fetchAPI(`/vendors/${vendorId}`);
    },
    updateProfile: async (vendorId, updates) => {
        return fetchAPI(`/vendors/${vendorId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates)
        });
    },
    getOrders: async (vendorId) => {
        return fetchAPI(`/vendors/${vendorId}/orders`);
    },
    getProducts: async (vendorId, availableOnly = false) => {
        const query = availableOnly ? '?available_only=true' : '';
        return fetchAPI(`/vendors/${vendorId}/products${query}`);
    },
    updateStatus: async (vendorId, status) => {
        return fetchAPI(`/vendors/${vendorId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ is_open: status })
        });
    }
};

export const ordersApi = {
    create: async (payload) => {
        return fetchAPI('/orders', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },
    updateStatus: async (orderId, status) => {
        return fetchAPI(`/orders/${orderId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    }
};

export const productsApi = {
    getAvailable: async () => {
        return fetchAPI('/products');
    },
    search: async (query) => {
        return fetchAPI(`/products/search?q=${encodeURIComponent(query)}`);
    },
    get: async (productId) => {
        return fetchAPI(`/products/${productId}`);
    },
    create: async (payload) => {
        return fetchAPI('/products', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },
    update: async (productId, payload) => {
        return fetchAPI(`/products/${productId}`, {
            method: 'PATCH',
            body: JSON.stringify(payload)
        });
    },
    updateAvailability: async (productId, isAvailable) => {
        return fetchAPI(`/products/${productId}/availability`, {
            method: 'PATCH',
            body: JSON.stringify({ is_available: isAvailable })
        });
    }
};

export const authApi = {
    getProfile: async (userId) => {
        return fetchAPI(`/auth/profile/${userId}`);
    },
    updateProfile: async (userId, updates) => {
        return fetchAPI(`/auth/profile/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates)
        });
    }
};

export const userApi = {
    getOrders: async (userId) => {
        return fetchAPI(`/users/${userId}/orders`);
    }
}

export const wholesaleApi = {
    getProfile: async (profileId) => {
        return fetchAPI(`/wholesale/profile/${profileId}`);
    },
    createProfile: async (profileData) => {
        return fetchAPI('/wholesale/profile', {
            method: 'POST',
            body: JSON.stringify(profileData),
        });
    },
    updateProfile: async (id, profileData) => {
        return fetchAPI(`/wholesale/profile/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(profileData),
        });
    },
    getDashboard: async (wholesalerId) => {
        return fetchAPI(`/wholesale/${wholesalerId}/dashboard`);
    },
    getProducts: async (wholesalerId) => {
        return fetchAPI(`/wholesale/${wholesalerId}/products`);
    },
    createProduct: async (productData) => {
        return fetchAPI('/wholesale/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    },
    updateProduct: async (id, productData) => {
        return fetchAPI(`/wholesale/products/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(productData),
        });
    },
    deleteProduct: async (id) => {
        return fetchAPI(`/wholesale/products/${id}`, {
            method: 'DELETE',
        });
    },
    getInquiries: async (wholesalerId) => {
        return fetchAPI(`/wholesale/${wholesalerId}/inquiries`);
    },
    updateInquiryStatus: async (id, status) => {
        return fetchAPI(`/wholesale/inquiries/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    }
};
