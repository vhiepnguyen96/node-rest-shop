const mongoose = require('mongoose');

const ratingLevelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ratingLevel: {
        type: Number,
        required: true
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('RatingLevel', ratingLevelSchema);