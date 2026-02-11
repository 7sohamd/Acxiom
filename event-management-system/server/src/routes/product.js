const express = require('express');
const router = express.Router();
const {
    getVendorProducts,
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

// Public/User routes
router.get('/all', getAllProducts);
router.get('/vendor/:vendorId', getVendorProducts);

// Vendor-only routes
router.post('/', auth, roleCheck('vendor'), upload.single('image'), addProduct);
router.put('/:id', auth, roleCheck('vendor'), upload.single('image'), updateProduct);
router.delete('/:id', auth, roleCheck('vendor'), deleteProduct);

module.exports = router;
