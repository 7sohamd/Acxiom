const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    duration: {
        type: String,
        enum: ['6 months', '1 year', '2 years'],
        default: '6 months'
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Membership', membershipSchema);
