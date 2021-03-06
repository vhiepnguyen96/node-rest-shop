const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    storeName: {
        type: String,
        required: true
    },
    location: {
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
    createdDate: {
        type: Date,
        required: true
    },
    categories: [{
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }
    }]
});

module.exports = mongoose.model('Store', storeSchema);