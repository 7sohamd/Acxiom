const express = require('express');
const router = express.Router();
const {
    createOrder,
    getUserOrders,
    getVendorOrders,
    updateOrderStatus,
    getOrderById
} = require('../controllers/orderController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// User routes
router.post('/', auth, roleCheck('user'), createOrder);
router.get('/user', auth, roleCheck('user'), getUserOrders);

// Vendor routes
router.get('/vendor/:vendorId', auth, roleCheck('vendor'), getVendorOrders);
router.put('/:id/status', auth, roleCheck('vendor'), updateOrderStatus);

// Common routes
router.get('/:id', auth, getOrderById);

module.exports = router;
