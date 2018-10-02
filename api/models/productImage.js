const mongoose = require('mongoose');

const productImageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    imageList: [{
        imageURL: String
    }]
});

module.exports = mongoose.model('ProductImage', productImageSchema);