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
    },
    birthday:{
        type: Date,
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String
    }
});

module.exports = mongoose.model('Customer', customerSchema);