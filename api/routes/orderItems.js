const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const OrderItem = require('../models/orderItem');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    OrderItem.find()
        .select('_id order product quantity')
        .populate('product', '_id productName price saleOff')
        .exec()
        .then((docs) => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    orderItems: docs.map(doc => {
                        return {
                            orderItemId: doc._id,
                            orderId: doc.order,
                            product: doc.product,
                            quantity: doc.quantity,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/orderItems/' + doc._id
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

router.get('/:orderItemId', (req, res, next) => {
    const id = req.params.orderItemId;
    OrderItem.findById(id)
        .select('_id order product quantity')
        .populate('product', '_id productName price saleOff')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    orderItem: {
                        orderItemId: doc._id,
                        orderId: doc.order,
                        product: doc.product,
                        quantity: doc.quantity,
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all order item at: http://localhost:3000/orderItems'
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

router.get('/order/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                })
            }
            OrderItem.find({
                    order: id
                })
                .select('_id order product quantity')
                .populate('product', '_id productName price saleOff')
                .exec()
                .then(docs => {
                    console.log(docs);
                    res.status(200).json({
                        count: docs.length,
                        orderItems: docs.map(doc => {
                            return {
                                orderItemId: doc._id,
                                orderId: doc.order,
                                product: doc.product,
                                quantity: doc.quantity,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/orderItems/' + doc._id
                                }
                            }
                        })
                    })
                })
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.post('/', (req, res, next) => {
    Order.findById(req.body.orderId)
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                })
            }
            Product.findById(req.body.productId)
                .then(product => {
                    if (!product) {
                        return res.status(404).json({
                            message: 'Product not found'
                        })
                    }
                    const orderItem = new OrderItem({
                        _id: new mongoose.Types.ObjectId(),
                        order: req.body.orderId,
                        product: req.body.productId,
                        quantity: req.body.quantity
                    })
                    return orderItem.save()
                })
                .then(doc => {
                    console.log(doc);
                    res.status(201).json({
                        message: 'Order item saved',
                        createdOrderItem: {
                            orderItemId: doc._id,
                            orderId: doc.order,
                            product: doc.product,
                            quantity: doc.quantity,
                        },
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orderItems/' + doc._id
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

router.patch('/:orderItemId', (req, res, next) => {
    const id = req.params.orderItemId;
    OrderItem.findById(id)
        .then((orderItem) => {
            if (!orderItem) {
                return res.status(404).json({
                    message: 'Order item not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            OrderItem.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Order item updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orderItems/' + id
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

router.delete('/:orderItemId', (req, res, next) => {
    const id = req.params.orderItemId;
    OrderItem.findById(id)
        .then((orderItem) => {
            if (!orderItem) {
                return res.status(404).json({
                    message: 'Order item not found'
                })
            }
            OrderItem.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Order item deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/orderItems',
                            body: {
                                orderId: 'Order ID',
                                productId: 'Product ID',
                                quantity: 'number'
                            }
                        }
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