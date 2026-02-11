import api from './api';

export const orderService = {
    // Create order (user)
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    // Get user orders
    getUserOrders: async () => {
        const response = await api.get('/orders/user');
        return response.data;
    },

    // Get vendor orders
    getVendorOrders: async (vendorId) => {
        const response = await api.get(`/orders/vendor/${vendorId}`);
        return response.data;
    },

    // Update order status (vendor)
    updateOrderStatus: async (orderId, status) => {
        const response = await api.put(`/orders/${orderId}/status`, { status });
        return response.data;
    },

    // Get order by ID
    getOrderById: async (orderId) => {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    }
};

export default orderService;
