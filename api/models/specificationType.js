const mongoose = require('mongoose');

const specificationTypeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType',
        required: true
    },
    specificationTitle: [{
        title: String
    }]
});

module.exports = mongoose.model('SpecificationType', specificationTypeSchema);