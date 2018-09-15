const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType',
        required: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    saleOff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SaleOff'
    },
    specifications: {
        type: Array,
        required: true
    },
    overviews: {
        type: Array
    }
});

module.exports = mongoose.model('Product', productSchema);