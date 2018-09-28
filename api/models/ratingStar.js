const mongoose = require('mongoose');

const ratingStarSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ratingStar: {
        type: Number,
        required: true
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('RatingStar', ratingStarSchema);