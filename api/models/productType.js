const mongoose = require('mongoose');

const productTypeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productTypeName: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
});

module.exports = mongoose.model('ProductType', productTypeSchema);