const mongoose = require('mongoose');

const orderStateSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    orderStateName: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('OrderState', orderStateSchema);