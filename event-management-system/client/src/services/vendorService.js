import api from './api';

export const vendorService = {
    // Get all vendors
    getAllVendors: async () => {
        const response = await api.get('/vendors/all');
        return response.data;
    },

    // Get vendors by category
    getVendorsByCategory: async (category) => {
        const response = await api.get(`/vendors/category/${category}`);
        return response.data;
    },

    // Get vendor dashboard (vendor only)
    getVendorDashboard: async () => {
        const response = await api.get('/vendors/dashboard');
        return response.data;
    },

    // Get vendor transactions (vendor only)
    getVendorTransactions: async () => {
        const response = await api.get('/vendors/transactions');
        return response.data;
    }
};

export default vendorService;
