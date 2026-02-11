const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create order
const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { customerDetails, paymentMethod } = req.body;

        console.log('Creating order for user:', userId);
        console.log('Customer details:', customerDetails);
        console.log('Payment method:', paymentMethod);

        // Get user's cart
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        console.log('Cart items:', cart.items.length);

        // Prepare order items
        const orderItems = [];
        let firstVendorId = null;

        for (const item of cart.items) {
            if (!item.productId) {
                console.error('Product not found for cart item');
                continue;
            }

            const product = await Product.findById(item.productId._id).populate('vendorId');

            if (!product) {
                console.error('Product not found:', item.productId._id);
                continue;
            }

            if (!product.vendorId) {
                console.error('Product has no vendor:', product._id);
                continue;
            }

            const vendorId = product.vendorId._id || product.vendorId;
            if (!firstVendorId) {
                firstVendorId = vendorId;
            }

            orderItems.push({
                productId: product._id,
                vendorId: vendorId,
                name: product.name,
                quantity: item.quantity,
                price: product.price
            });
        }

        if (orderItems.length === 0) {
            return res.status(400).json({ message: 'No valid products in cart' });
        }

        // Calculate total
        const totalAmount = orderItems.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        );

        console.log('Order items:', orderItems.length);
        console.log('Total amount:', totalAmount);

        // Create order
        const order = await Order.create({
            userId,
            items: orderItems,
            totalAmount,
            customerDetails,
            paymentMethod,
            status: 'Received',
            vendorId: firstVendorId
        });

        console.log('Order created:', order._id);

        // Clear cart after order creation
        cart.items = [];
        await cart.save();

        res.status(201).json({
            message: 'Order placed successfully',
            order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ userId })
            .populate('items.productId', 'name imageUrl')
            .populate('vendorId', 'name category')
            .sort({ createdAt: -1 });

        res.json({ orders });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get vendor orders
const getVendorOrders = async (req, res) => {
    try {
        const { vendorId } = req.params;

        const orders = await Order.find({ vendorId })
            .populate('userId', 'name email')
            .populate('items.productId', 'name imageUrl')
            .sort({ createdAt: -1 });

        res.json({ orders });
    } catch (error) {
        console.error('Get vendor orders error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update order status (vendor only)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Received', 'Ready for Shipping', 'Out For Delivery'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single order details
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate('userId', 'name email')
            .populate('items.productId', 'name imageUrl')
            .populate('vendorId', 'name category');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ order });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getVendorOrders,
    updateOrderStatus,
    getOrderById
};
