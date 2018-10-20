const mongoose = require('mongoose');

const deliveryPriceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    totalPriceMin: {
        type: Number
    },
    totalPriceMax: {
        type: Number,
        default: null
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