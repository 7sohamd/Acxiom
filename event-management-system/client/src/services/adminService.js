import api from './api';

export const adminService = {
    // User Management
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    createUser: async (userData) => {
        const response = await api.post('/admin/users', userData);
        return response.data;
    },

    updateUser: async (userId, userData) => {
        const response = await api.put(`/admin/users/${userId}`, userData);
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },

    // Vendor Management
    getAllVendorsAdmin: async () => {
        const response = await api.get('/admin/vendors');
        return response.data;
    },

    createVendor: async (vendorData) => {
        const response = await api.post('/admin/vendors', vendorData);
        return response.data;
    },

    updateVendor: async (vendorId, vendorData) => {
        const response = await api.put(`/admin/vendors/${vendorId}`, vendorData);
        return response.data;
    },

    deleteVendor: async (vendorId) => {
        const response = await api.delete(`/admin/vendors/${vendorId}`);
        return response.data;
    },

    // Membership Management
    getAllMemberships: async () => {
        const response = await api.get('/admin/memberships');
        return response.data;
    },

    createMembership: async (membershipData) => {
        const response = await api.post('/admin/memberships', membershipData);
        return response.data;
    },

    extendMembership: async (vendorId, months = 6) => {
        const response = await api.put('/admin/memberships/extend', { vendorId, months });
        return response.data;
    },

    cancelMembership: async (vendorId) => {
        const response = await api.put('/admin/memberships/cancel', { vendorId });
        return response.data;
    }
};

export default adminService;
