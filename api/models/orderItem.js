const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    product: {
        _id : {
            type: String,
            require: true
        },
        productName: {
            type: String,
            require: true
        },
        price: {
            type: Number,
            required: true
        },
        store: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Store'
            },
            storeName: {
                type: String
            }    
        },
        imageURL: {
            type: String,
            required: true
        }
    },
    quantity: {
        type: Number,
        required: true
    },
    orderItemState: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderState',
        required: true
    },
    isReview: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('OrderItem', orderItemSchema);