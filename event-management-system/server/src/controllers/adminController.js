const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Membership = require('../models/Membership');
const bcrypt = require('bcryptjs');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ users });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create user (admin)
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        await user.save();

        res.json({
            message: 'User updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all vendors (admin view)
const getAdminVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('userId', 'name email');
        res.json({ vendors });
    } catch (error) {
        console.error('Get admin vendors error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create vendor (admin)
const createVendor = async (req, res) => {
    try {
        const { name, email, password, category, contactDetails } = req.body;

        // Create user account first
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'vendor'
        });

        // Create vendor profile
        const vendor = await Vendor.create({
            userId: user._id,
            name,
            email,
            category,
            contactDetails: contactDetails || ''
        });

        res.status(201).json({
            message: 'Vendor created successfully',
            vendor
        });
    } catch (error) {
        console.error('Create vendor error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update vendor
const updateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, category, contactDetails } = req.body;

        const vendor = await Vendor.findById(id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        if (name) vendor.name = name;
        if (email) vendor.email = email;
        if (category) vendor.category = category;
        if (contactDetails !== undefined) vendor.contactDetails = contactDetails;

        await vendor.save();

        res.json({
            message: 'Vendor updated successfully',
            vendor
        });
    } catch (error) {
        console.error('Update vendor error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete vendor
const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;

        const vendor = await Vendor.findById(id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Also delete associated user account
        await User.findByIdAndDelete(vendor.userId);
        await Vendor.findByIdAndDelete(id);

        res.json({ message: 'Vendor deleted successfully' });
    } catch (error) {
        console.error('Delete vendor error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Membership Management

// Get all memberships
const getAllMemberships = async (req, res) => {
    try {
        const memberships = await Membership.find().populate('vendorId', 'name email');
        res.json({ memberships });
    } catch (error) {
        console.error('Get memberships error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create membership
const createMembership = async (req, res) => {
    try {
        const { vendorId, duration } = req.body;

        // Calculate end date based on duration
        const startDate = new Date();
        let endDate = new Date();

        switch (duration) {
            case '6 months':
                endDate.setMonth(endDate.getMonth() + 6);
                break;
            case '1 year':
                endDate.setFullYear(endDate.getFullYear() + 1);
                break;
            case '2 years':
                endDate.setFullYear(endDate.getFullYear() + 2);
                break;
            default:
                endDate.setMonth(endDate.getMonth() + 6); // Default to 6 months
        }

        const membership = await Membership.create({
            vendorId,
            startDate,
            endDate,
            duration,
            status: 'active'
        });

        res.status(201).json({
            message: 'Membership created successfully',
            membership
        });
    } catch (error) {
        console.error('Create membership error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update/Extend membership
const updateMembership = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, duration } = req.body; // action: 'extend' or 'cancel'

        const membership = await Membership.findById(id);
        if (!membership) {
            return res.status(404).json({ message: 'Membership not found' });
        }

        if (action === 'extend') {
            const extensionDuration = duration || '6 months'; // Default to 6 months
            const currentEndDate = new Date(membership.endDate);

            switch (extensionDuration) {
                case '6 months':
                    currentEndDate.setMonth(currentEndDate.getMonth() + 6);
                    break;
                case '1 year':
                    currentEndDate.setFullYear(currentEndDate.getFullYear() + 1);
                    break;
                case '2 years':
                    currentEndDate.setFullYear(currentEndDate.getFullYear() + 2);
                    break;
            }

            membership.endDate = currentEndDate;
            membership.status = 'active';
        } else if (action === 'cancel') {
            membership.status = 'cancelled';
        }

        await membership.save();

        res.json({
            message: 'Membership updated successfully',
            membership
        });
    } catch (error) {
        console.error('Update membership error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
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
};
