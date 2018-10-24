const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const DeliveryAddress = require('../models/deliveryAddress');
const Customer = require('../models/customer');
const DeliveryPrice = require('../models/deliveryPrice');
const PaymentMethod = require('../models/paymentMethod');
const OrderState = require('../models/orderState');
const OrderItem = require('../models/orderItem');

router.get('/', (req, res, next) => {
    Order.find()
        .select('_id totalQuantity totalPrice purchaseDate customer deliveryAddress deliveryPrice paymentMethod orderState')
        .populate('customer', 'name')
        .populate('deliveryPrice', 'transportFee')
        .populate('paymentMethod', 'paymentMethodName')
        .populate('orderState', 'orderStateName')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    orders: docs.map(doc => {
                        return {
                            _id: doc._id,
                            customer: doc.customer,
                            deliveryAddress: doc.deliveryAddress,
                            deliveryPrice: doc.deliveryPrice,
                            totalQuantity: doc.totalQuantity,
                            totalPrice: doc.totalPrice,
                            purchaseDate: doc.purchaseDate,
                            paymentMethod: doc.paymentMethod,
                            orderState: doc.orderState,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/orders/' + doc._id
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

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('_id totalQuantity totalPrice purchaseDate customer deliveryAddress deliveryPrice paymentMethod orderState')
        .populate('customer', 'name')
        .populate('deliveryPrice', 'transportFee')
        .populate('paymentMethod', 'paymentMethodName')
        .populate('orderState', 'orderStateName')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    product: {
                        _id: doc._id,
                        customer: doc.customer,
                        deliveryAddress: doc.deliveryAddress,
                        deliveryPrice: doc.deliveryPrice,
                        totalQuantity: doc.totalQuantity,
                        totalPrice: doc.totalPrice,
                        purchaseDate: doc.purchaseDate,
                        paymentMethod: doc.paymentMethod,
                        orderState: doc.orderState,
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all order at: http://localhost:3000/orders'
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

router.get('/customer/:customerId', (req, res, next) => {
    Order.find({
            customer: req.params.customerId
        })
        .select('_id totalQuantity totalPrice purchaseDate customer deliveryAddress deliveryPrice paymentMethod orderState')
        .populate('customer', 'name')
        .populate('deliveryPrice', 'transportFee')
        .populate('paymentMethod', 'paymentMethodName')
        .populate('orderState', 'orderStateName')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    orders: docs.map(doc => {
                        return {
                            _id: doc._id,
                            customer: doc.customer,
                            deliveryAddress: doc.deliveryAddress,
                            deliveryPrice: doc.deliveryPrice,
                            totalQuantity: doc.totalQuantity,
                            totalPrice: doc.totalPrice,
                            purchaseDate: doc.purchaseDate,
                            paymentMethod: doc.paymentMethod,
                            orderState: doc.orderState,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/orders/' + doc._id
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
        });
});

router.post('/purchased', (req, res, next) => {
    Order.find({
            customer: req.body.customerId,
            orderState: req.body.orderStateId
        })
        .select('_id totalQuantity totalPrice purchaseDate customer deliveryAddress deliveryPrice paymentMethod orderState')
        .populate('customer', 'name')
        .populate('deliveryPrice', 'transportFee')
        .populate('paymentMethod', 'paymentMethodName')
        .populate('orderState', 'orderStateName')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    orders: docs.map(doc => {
                        return {
                            _id: doc._id,
                            customer: doc.customer,
                            deliveryAddress: doc.deliveryAddress,
                            deliveryPrice: doc.deliveryPrice,
                            totalQuantity: doc.totalQuantity,
                            totalPrice: doc.totalPrice,
                            purchaseDate: doc.purchaseDate,
                            paymentMethod: doc.paymentMethod,
                            orderState: doc.orderState,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/orders/' + doc._id
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
        });
});

router.post('/', (req, res, next) => {
    Customer.findById(req.body.customerId)
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: 'Customer not found'
                })
            }
            DeliveryPrice.findById(req.body.deliveryPriceId)
                .then((result) => {
                    if (!result) {
                        return res.status(404).json({
                            message: 'Delivery price not found'
                        })
                    }
                    PaymentMethod.findById(req.body.paymentMethodId)
                        .then(result => {
                            if (!result) {
                                return res.status(404).json({
                                    message: 'Payment method not found'
                                })
                            }
                            OrderState.findById(req.body.orderStateId)
                                .then(result => {
                                    if (!result) {
                                        return res.status(404).json({
                                            message: 'Order state not found'
                                        })
                                    }
                                    const order = new Order({
                                        _id: new mongoose.Types.ObjectId(),
                                        customer: req.body.customerId,
                                        deliveryAddress: req.body.deliveryAddress,
                                        deliveryPrice: req.body.deliveryPriceId,
                                        totalQuantity: req.body.totalQuantity,
                                        totalPrice: req.body.totalPrice,
                                        purchaseDate: new Date(),
                                        paymentMethod: req.body.paymentMethodId,
                                        orderState: req.body.orderStateId
                                    })
                                    return order.save()
                                })
                                .then(doc => {
                                    console.log(doc);
                                    res.status(201).json({
                                        message: 'Order saved',
                                        createdOrder: {
                                            _id: doc._id,
                                            customer: doc.customer,
                                            deliveryAddress: doc.deliveryAddress,
                                            deliveryPrice: doc.deliveryPrice,
                                            totalQuantity: doc.totalQuantity,
                                            totalPrice: doc.totalPrice,
                                            purchaseDate: doc.purchaseDate,
                                            paymentMethod: doc.paymentMethod,
                                            orderState: doc.orderState,
                                        },
                                        request: {
                                            type: 'GET',
                                            url: 'http://localhost:3000/orders/' + doc._id
                                        }
                                    });
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

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: 'Order not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            Order.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json([{
                        message: 'Order updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + id
                        }
                    }]);
                }).catch((err) => {
                    res.status(500).json([{
                        message: 'Order update error',
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

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: 'Order not found'
                })
            }
            OrderItem.find({
                    order: id
                })
                .then(docs => {
                    if (docs.length > 0) {
                        return res.status(500).json({
                            message: 'Order is already used',
                            result: docs
                        })
                    }
                    Order.deleteOne({
                            _id: id
                        })
                        .exec()
                        .then(result => {
                            res.status(200).json({
                                message: 'Order deleted',
                                request: {
                                    type: 'POST',
                                    url: 'http://localhost:3000/orders',
                                    body: {
                                        customerId: 'Customer ID',
                                        deliveryAddressId: 'DeliveryAddress ID',
                                        deliveryPriceId: 'DeliveryPrice ID',
                                        totalQuantity: 'Number',
                                        totalPrice: 'String',
                                        paymentMethodId: 'PaymentMethod ID',
                                        orderStateId: 'OrderState ID'
                                    }
                                }
                            })
                        }).catch((err) => {
                            res.status(500).json({
                                message: 'Order delete error',
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