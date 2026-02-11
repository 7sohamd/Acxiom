const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getAdminVendors,
    createVendor,
    updateVendor,
    deleteVendor,
    getAllMemberships,
    createMembership,
    updateMembership
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All admin routes require admin authentication
const adminAuth = [auth, roleCheck('admin')];

// User management
router.get('/users', adminAuth, getAllUsers);
router.post('/users', adminAuth, createUser);
router.put('/users/:id', adminAuth, updateUser);
router.delete('/users/:id', adminAuth, deleteUser);

// Vendor management
router.get('/vendors', adminAuth, getAdminVendors);
router.post('/vendors', adminAuth, createVendor);
router.put('/vendors/:id', adminAuth, updateVendor);
router.delete('/vendors/:id', adminAuth, deleteVendor);

// Membership management
router.get('/memberships', adminAuth, getAllMemberships);
router.post('/memberships', adminAuth, createMembership);
router.put('/memberships/:id', adminAuth, updateMembership);

module.exports = router;
