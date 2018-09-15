const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    rating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    dateReview: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Review', reviewSchema);