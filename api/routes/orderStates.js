const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const OrderState = require('../models/orderState');
const Order = require('../models/order');

router.get('/', (req, res, next) => {
    OrderState.find()
        .select('_id orderStateName description')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    orderStates: docs.map(doc => {
                        return {
                            orderStateId: doc._id,
                            orderStateName: doc.orderStateName,
                            description: doc.description,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/orderStates/' + doc._id
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

router.get('/:orderStateId', (req, res, next) => {
    OrderState.findById(req.params.orderStateId)
        .select('_id orderStateName description')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    orderState: {
                        orderStateId: doc._id,
                        orderStateName: doc.orderStateName,
                        description: doc.description,
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all order state at: http://localhost:3000/orderStates'
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
    OrderState.findOne({
            orderStateName: req.body.orderStateName
        })
        .then((result) => {
            if (result) {
                return res.status(500).json({
                    message: 'Order state is already',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orderStates/' + result._id
                    }
                })
            }
            const orderState = new OrderState({
                _id: new mongoose.Types.ObjectId(),
                orderStateName: req.body.orderStateName,
                description: req.body.description
            });
            orderState.save()
                .then((result) => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Created order state successfully',
                        createdOrderState: {
                            orderStateId: result._id,
                            orderStateName: result.orderStateName,
                            description: result.description,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/orderStates/' + result._id
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

router.patch('/:orderStateId', (req, res, next) => {
    const id = req.params.orderStateId;
    OrderState.findById(id)
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: 'Order state not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            OrderState.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Order state updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orderStates/' + id
                        }
                    });
                })
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.delete('/:orderStateId', (req, res, next) => {
    const id = req.params.orderStateId;
    OrderState.findById(id)
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: 'Order state not found'
                })
            }
            Order.find({
                    orderState: id
                })
                .then(docs => {
                    if (docs.length > 0) {
                        return res.status(500).json({
                            message: 'Order state is already used',
                            result: docs
                        })
                    }
                    OrderState.deleteOne({
                            _id: id
                        })
                        .exec()
                        .then(result => {
                            res.status(200).json({
                                message: 'Order state deleted',
                                request: {
                                    type: 'POST',
                                    url: 'http://localhost:3000/orderStates',
                                    body: {
                                        orderStateName: 'String',
                                        description: 'String'
                                    }
                                }
                            });
                        })
                })
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;