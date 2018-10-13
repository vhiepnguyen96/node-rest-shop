const mongoose = require('mongoose');

const productTypeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productTypeName: {
        type: String,
        required: true
    },
    imageURL: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
});

module.exports = mongoose.model('ProductType', productTypeSchema);