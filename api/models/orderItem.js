const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('OrderItem', orderItemSchema);