const mongoose = require('mongoose');

const paymentMethodSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    paymentMethodName: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);