const mongoose = require('mongoose');

const saleOffSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
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