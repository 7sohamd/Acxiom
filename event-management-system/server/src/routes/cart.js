const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All cart routes require user authentication
router.get('/', auth, roleCheck('user'), getCart);
router.post('/add', auth, roleCheck('user'), addToCart);
router.put('/update', auth, roleCheck('user'), updateCartItem);
router.delete('/remove/:productId', auth, roleCheck('user'), removeFromCart);
router.delete('/clear', auth, roleCheck('user'), clearCart);

module.exports = router;
