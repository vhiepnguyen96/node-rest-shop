const mongoose = require('mongoose');

const registeredSaleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    storeName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    registeredDate: {
        type: Date,
        required: true
    },
    isApprove: {
        type: Boolean
    }
});

module.exports = mongoose.model('RegisteredSale', registeredSaleSchema);