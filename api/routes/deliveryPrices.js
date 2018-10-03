const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const DeliveryPrice = require('../models/deliveryPrice');
const Order = require('../models/order');

router.get('/', (req, res, next) => {
    DeliveryPrice.find()
        .select('_id productQuantity transportFee description')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    deliveryPrices: docs.map(doc => {
                        return {
                            deliveryPriceId: doc._id,
                            productQuantity: doc.productQuantity,
                            transportFee: doc.transportFee,
                            description: doc.description,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/deliveryPrices/' + doc._id
                            }
                        }
                    })
                });
            } else {
                res.status(404).json({
                    message: "No entries found"
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.get('/:deliveryPriceId', (req, res, next) => {
    DeliveryPrice.findById(req.params.deliveryPriceId)
        .select('_id productQuantity transportFee description')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    category: {
                        deliveryPriceId: doc._id,
                        productQuantity: doc.productQuantity,
                        transportFee: doc.transportFee,
                        description: doc.description,
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all delivery price at: http://localhost:3000/deliveryPrices'
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
    DeliveryPrice.findOne({
            productQuantity: req.body.productQuantity
        })
        .then((result) => {
            if (result) {
                return res.status(500).json({
                    message: 'Transport fee of product quantity is already',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/deliveryPrices/' + result._id
                    }
                })
            }
            const deliveryPrice = new DeliveryPrice({
                _id: new mongoose.Types.ObjectId(),
                productQuantity: req.body.productQuantity,
                transportFee: req.body.transportFee,
                description: req.body.description
            });
            deliveryPrice.save()
                .then((result) => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Created delivery price successfully',
                        createdDeliveryPrice: {
                            deliveryPriceId: result._id,
                            productQuantity: result.productQuantity,
                            transportFee: result.transportFee,
                            description: result.description,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/deliveryPrices/' + result._id
                            }
                        }
                    });
                })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.patch('/:deliveryPriceId', (req, res, next) => {
    const id = req.params.deliveryPriceId;
    DeliveryPrice.findById(id)
        .then((deliveryPrice) => {
            if (!deliveryPrice) {
                return res.status(404).json({
                    message: 'Delivery price not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            DeliveryPrice.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Delivery price updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/deliveryPrices/' + id
                        }
                    });
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Delivery price update error',
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

router.delete('/:deliveryPriceId', (req, res, next) => {
    const id = req.params.deliveryPriceId;
    DeliveryPrice.findById(id)
        .then((deliveryPrice) => {
            if (!deliveryPrice) {
                return res.status(404).json({
                    message: 'Delivery price not found'
                })
            }
            Order.find({
                    deliveryPrice: id
                })
                .then(docs => {
                    if (docs.length > 0) {
                        return res.status(500).json({
                            message: 'Delivery price is already used',
                            result: docs
                        })
                    }
                    DeliveryPrice.deleteOne({
                            _id: id
                        })
                        .exec()
                        .then(result => {
                            res.status(200).json({
                                message: 'Delivery price deleted',
                                request: {
                                    type: 'POST',
                                    url: 'http://localhost:3000/deliveryPrices',
                                    body: {
                                        productQuantity: 'Number',
                                        transportFee: 'String',
                                        description: 'String'
                                    }
                                }
                            });
                        }).catch((err) => {
                            res.status(500).json({
                                message: 'Delivery price delete error',
                                error: err
                            })
                        });
                })
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;