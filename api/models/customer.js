const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    account: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: null
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
        default: null
    }
});

module.exports = mongoose.model('Customer', customerSchema);