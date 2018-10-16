const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const PaymentMethod = require('../models/paymentMethod');
const Order = require('../models/order');

router.get('/', (req, res, next) => {
    PaymentMethod.find()
        .select('_id paymentMethodName description')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    paymentMethods: docs.map(doc => {
                        return {
                            _id: doc._id,
                            paymentMethodName: doc.paymentMethodName,
                            description: doc.description,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/paymentMethods/' + doc._id
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

router.get('/:paymentMethodId', (req, res, next) => {
    PaymentMethod.findById(req.params.paymentMethodId)
        .select('_id paymentMethodName description')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    _id: doc._id,
                    paymentMethodName: doc.paymentMethodName,
                    description: doc.description,
                    request: {
                        type: 'GET',
                        description: 'Get all payment method at: http://localhost:3000/paymentMethods'
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
    const paymentMethod = new PaymentMethod({
        _id: new mongoose.Types.ObjectId(),
        paymentMethodName: req.body.paymentMethodName,
        description: req.body.description
    });
    paymentMethod.save()
        .then((result) => {
            console.log(result);
            res.status(201).json({
                message: 'Created payment method successfully',
                createdPaymentMethod: {
                    _id: result._id,
                    paymentMethodName: result.paymentMethodName,
                    description: result.description,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/paymentMethods/' + result._id
                    }
                }
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.patch('/:paymentMethodId', (req, res, next) => {
    const id = req.params.paymentMethodId;
    PaymentMethod.findById(id)
        .then((paymentMethod) => {
            if (!paymentMethod) {
                return res.status(404).json({
                    message: 'Payment method not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            PaymentMethod.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json([{
                        message: 'Payment method updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/paymentMethods/' + id
                        }
                    }]);
                }).catch((err) => {
                    res.status(500).json([{
                        message: 'Payment method update error',
                        error: err
                    }])
                });
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.delete('/:paymentMethodId', (req, res, next) => {
    const id = req.params.paymentMethodId;
    PaymentMethod.findById(id)
        .then((paymentMethod) => {
            if (!paymentMethod) {
                return res.status(404).json({
                    message: 'Payment method not found'
                })
            }
            Order.find({
                    paymentMethod: id
                })
                .then(docs => {
                    if (docs.length > 0) {
                        return res.status(500).json({
                            message: 'Payment method is already used',
                            result: docs
                        })
                    }
                    PaymentMethod.deleteOne({
                            _id: id
                        })
                        .exec()
                        .then(result => {
                            res.status(200).json({
                                message: 'Payment method deleted',
                                request: {
                                    type: 'POST',
                                    url: 'http://localhost:3000/paymentMethods',
                                    body: {
                                        paymentMethodName: 'String',
                                        description: 'String'
                                    }
                                }
                            });
                        }).catch((err) => {
                            res.status(500).json({
                                message: 'Payment method delete error',
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