const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const SpecificationType = require('../models/specificationType');
const ProductType = require('../models/productType');

router.get('/', (req, res, next) => {
    SpecificationType.find()
        .select('_id specificationTitle productType')
        .populate('productType', '_id productTypeName')
        .exec()
        .then((docs) => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    specificationTypes: docs.map(doc => {
                        return {
                            _id: doc._id,
                            productType: doc.productType,
                            specificationTitle: doc.specificationTitle,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/specificationTypes/' + doc._id
                            }
                        }
                    })
                });
            } else {
                res.status(404).json({
                    message: "No entries found"
                })
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.get('/:specificationTypeId', (req, res, next) => {
    const id = req.params.specificationTypeId;
    SpecificationType.findById(id)
        .select('_id specificationTitle productType')
        .populate('productType', '_id productTypeName')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    specificationType: {
                        _id: doc._id,
                        productType: doc.productType,
                        specificationTitle: doc.specificationTitle
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all specification type at: http://localhost:3000/specificationTypes'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No vaild entry found for provided ID'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.get('/productType/:productTypeId', (req, res, next) => {
    const id = req.params.productTypeId;
    SpecificationType.findOne({
            productType: id
        })
        .select('_id specificationTitle productType')
        .populate('productType', '_id productTypeName')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    specificationType: {
                        _id: doc._id,
                        productType: doc.productType,
                        specificationTitle: doc.specificationTitle,
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all specification type at: http://localhost:3000/specificationTypes'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No vaild entry found for provided ID'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.post('/', (req, res, next) => {
    SpecificationType.findOne({
            productType: req.body.productTypeId
        })
        .then((result) => {
            if (result) {
                return res.status(500).json({
                    message: 'Specification type of product type is already',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/specificationTypes/' + result._id
                    }
                })
            }
            ProductType.findById(req.body.productTypeId)
                .then(productType => {
                    if (!productType) {
                        return res.status(404).json({
                            message: 'Product type not found'
                        })
                    }
                    const specificationType = new SpecificationType({
                        _id: new mongoose.Types.ObjectId(),
                        productType: req.body.productTypeId,
                        specificationTitle: req.body.specificationTitle
                    })
                    return specificationType.save()
                })
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Specification type stored',
                        createdSpecificationType: {
                            _id: result._id,
                            productType: result.productType,
                            specificationTitle: result.specificationTitle
                        },
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/specificationTypes/' + result._id
                        }
                    });
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

router.patch('/:specificationTypeId', (req, res, next) => {
    const id = req.params.specificationTypeId;
    SpecificationType.findById(id)
        .then((specificationType) => {
            if (!specificationType) {
                return res.status(404).json({
                    message: 'Specification type not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            SpecificationType.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Specification type updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/specificationTypes/' + id
                        }
                    });
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Specification type update error',
                        error: err
                    })
                });
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.delete('/:specificationTypeId', (req, res, next) => {
    const id = req.params.specificationTypeId;
    SpecificationType.findById(id)
        .then((specificationType) => {
            if (!specificationType) {
                return res.status(404).json({
                    message: 'Specification type not found'
                })
            }
            SpecificationType.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Specification type deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/specificationTypes',
                            body: {
                                specificationTitle: 'Array',
                                productTypeId: 'ProductType ID'
                            }
                        }
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Specification type delete error',
                        error: err
                    })
                });
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;