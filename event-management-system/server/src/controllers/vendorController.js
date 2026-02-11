const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Get all vendors
const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('userId', 'name email');
        res.json({ vendors });
    } catch (error) {
        console.error('Get all vendors error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get vendors by category
const getVendorsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const vendors = await Vendor.find({ category });
        res.json({ vendors });
    } catch (error) {
        console.error('Get vendors by category error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get vendor dashboard data
const getVendorDashboard = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ userId: req.user._id });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const products = await Product.find({ vendorId: vendor._id });
        const orders = await Order.find({ vendorId: vendor._id });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        res.json({
            vendor,
            stats: {
                totalProducts: products.length,
                totalOrders: orders.length,
                totalRevenue,
                pendingOrders: orders.filter(o => o.status === 'Received').length
            }
        });
    } catch (error) {
        console.error('Get vendor dashboard error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get vendor transactions
const getVendorTransactions = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ userId: req.user._id });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const orders = await Order.find({ vendorId: vendor._id })
            .populate('userId', 'name email')
            .populate('items.productId', 'name')
            .sort({ createdAt: -1 });

        res.json({ transactions: orders });
    } catch (error) {
        console.error('Get vendor transactions error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllVendors,
    getVendorsByCategory,
    getVendorDashboard,
    getVendorTransactions
};
