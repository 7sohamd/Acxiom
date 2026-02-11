const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Vendor name is required'],
        trim: true
    },
    category: {
        type: String,
        enum: ['Catering', 'Florist', 'Decoration', 'Lighting'],
        required: [true, 'Category is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true
    },
    contactDetails: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vendor', vendorSchema);
