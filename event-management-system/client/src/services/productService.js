import api from './api';

export const productService = {
    // Get all products
    getAllProducts: async () => {
        const response = await api.get('/products/all');
        return response.data;
    },

    // Get vendor products
    getVendorProducts: async (vendorId) => {
        const response = await api.get(`/products/vendor/${vendorId}`);
        return response.data;
    },

    // Add product (vendor only)
    addProduct: async (formData) => {
        const response = await api.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Update product (vendor only)
    updateProduct: async (id, formData) => {
        const response = await api.put(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Delete product (vendor only)
    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    }
};

export default productService;
