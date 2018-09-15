const mongoose = require('mongoose');

const saleOffSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    discount: {
        type: Number,
        required: true
    },
    dateStart: {
        type: Date,
        required: true
    },
    dateEnd: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('SaleOff', saleOffSchema);