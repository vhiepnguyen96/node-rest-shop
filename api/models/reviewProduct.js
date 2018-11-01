const mongoose = require('mongoose');

const reviewProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
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
        imageURL: {
            type: String,
            required: true
        }
    },
    ratingStar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RatingStar',
        required: true
    },
    review: {
        type: String,
    },
    dateReview: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('ReviewProduct', reviewProductSchema);