const express = require('express');
const router = express.Router();
const {
    getAllVendors,
    getVendorsByCategory,
    getVendorDashboard,
    getVendorTransactions
} = require('../controllers/vendorController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Public routes (for users to browse vendors)
router.get('/all', getAllVendors);
router.get('/category/:category', getVendorsByCategory);

// Vendor-only routes
router.get('/dashboard', auth, roleCheck('vendor'), getVendorDashboard);
router.get('/transactions', auth, roleCheck('vendor'), getVendorTransactions);

module.exports = router;
