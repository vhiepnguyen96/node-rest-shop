const mongoose = require('mongoose');

const reviewStoreSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    ratingLevel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RatingLevel',
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

module.exports = mongoose.model('ReviewStore', reviewStoreSchema);