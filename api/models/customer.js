const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    birthday:{
        type: Date,
        default: null
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Customer', customerSchema);