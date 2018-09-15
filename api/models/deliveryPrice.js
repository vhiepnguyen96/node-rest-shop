const mongoose = require('mongoose');

const deliveryPriceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productQuantity: {
        type: Number,
        required: true
    },
    transportFee: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('DeliveryPrice', deliveryPriceSchema);