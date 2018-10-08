const mongoose = require('mongoose');

const filterTypeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    filterName: {
        type: String,
        required: true
    },
    filterItems: [{
        title: String,
        value: String,
        isChoose: {
            type: Boolean,
            default: false
        }
    }]
});

module.exports = mongoose.model('FilterType', filterTypeSchema);