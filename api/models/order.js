const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    deliveryAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryAddress',
        required: true
    },
    deliveryPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryPrice',
        required: true
    },
    totalQuantity: {
        type: Number,
        default: 1
    },
    totalPrice: {
        type: String,
        required: true
    },
    purchaseDate: {
        type: Date,
        required: true
    },
    paymentMethod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethod',
        required: true
    },
    orderState: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderState',
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);