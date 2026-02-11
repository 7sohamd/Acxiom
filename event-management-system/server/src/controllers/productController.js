const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

// Get all products by vendor
const getVendorProducts = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const products = await Product.find({ vendorId }).sort({ createdAt: -1 });

        res.json({ products });
    } catch (error) {
        console.error('Get vendor products error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all products for a user (optional vendor filter)
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('vendorId', 'name category');
        res.json({ products });
    } catch (error) {
        console.error('Get all products error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add new product (vendor only)
const addProduct = async (req, res) => {
    try {
        const { name, price } = req.body;

        // Get vendor ID from authenticated user
        const vendor = await Vendor.findOne({ userId: req.user._id });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }

        // Get image URL if uploaded
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

        const product = await Product.create({
            vendorId: vendor._id,
            name,
            price,
            imageUrl
        });

        res.status(201).json({
            message: 'Product added successfully',
            product
        });
    } catch (error) {
        console.error('Add product error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update product (vendor only)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        // Get vendor ID
        const vendor = await Vendor.findOne({ userId: req.user._id });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }

        // Find product and verify ownership
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.vendorId.toString() !== vendor._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        // Update fields
        if (name) product.name = name;
        if (price) product.price = price;
        if (req.file) product.imageUrl = `/uploads/${req.file.filename}`;

        await product.save();

        res.json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete product (vendor only)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Get vendor ID
        const vendor = await Vendor.findOne({ userId: req.user._id });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }

        // Find product and verify ownership
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.vendorId.toString() !== vendor._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        await Product.findByIdAndDelete(id);

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getVendorProducts,
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct
};
