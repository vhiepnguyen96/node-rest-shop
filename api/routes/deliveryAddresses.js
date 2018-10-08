const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const DeliveryAddress = require('../models/deliveryAddress');
const Customer = require('../models/customer');

router.get('/', (req, res, next) => {
    DeliveryAddress.find()
        .select('_id customer presentation phoneNumber address')
        .populate('customer', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                deliveryAddresses: docs.map(doc => {
                    return {
                        _id: doc._id,
                        customer: doc.customer,
                        presentation: doc.presentation,
                        phoneNumber: doc.phoneNumber,
                        address: doc.address,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/deliveryAddresses/' + doc._id
                        }
                    }
                })
            }
            console.log(response);
            if (docs.length >= 0) {
                res.status(200).json(response);
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

router.get('/:deliveryAddressId', (req, res, next) => {
    const id = req.params.deliveryAddressId;
    DeliveryAddress.findById(id)
        .select('_id customer presentation phoneNumber address')
        .populate('customer', 'name')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    deliveryAddress: {
                        _id: doc._id,
                        customer: doc.customer,
                        presentation: doc.presentation,
                        phoneNumber: doc.phoneNumber,
                        address: doc.address
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all deliveryAddress at: http://localhost:3000/deliveryAddresses'
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
    DeliveryAddress.find({
            customer: req.params.customerId
        })
        .select('_id customer presentation phoneNumber address')
        .populate('customer', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                deliveryAddresses: docs.map(doc => {
                    return {
                        _id: doc._id,
                        customer: doc.customer,
                        presentation: doc.presentation,
                        phoneNumber: doc.phoneNumber,
                        address: doc.address,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/deliveryAddresses/' + doc._id
                        }
                    }
                })
            }
            console.log(response);
            if (docs.length >= 0) {
                res.status(200).json(response);
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

router.post('/', (req, res, next) => {
    Customer.findById(req.body.customerId)
        .then(customer => {
            if (!customer) {
                return res.status(404).json({
                    message: 'Customer not found'
                })
            }
            const deliveryAddress = new DeliveryAddress({
                _id: new mongoose.Types.ObjectId(),
                customer: req.body.customerId,
                presentation: req.body.presentation,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address
            })
            return deliveryAddress.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Delivery address stored',
                createdDeliveryAddress: {
                    _id: result._id,
                    customer: result.customer,
                    presentation: result.presentation,
                    phoneNumber: result.phoneNumber,
                    address: result.address
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/deliveryAddresses/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

router.patch('/:deliveryAddressId', (req, res, next) => {
    const id = req.params.deliveryAddressId;
    DeliveryAddress.findById(id)
        .then((deliveryAddress) => {
            if (!deliveryAddress) {
                return res.status(404).json({
                    message: 'Delivery address not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            DeliveryAddress.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Delivery address updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/deliveryAddresses/' + id
                        }
                    });
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Delivery address update error',
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

router.delete('/:deliveryAddressId', (req, res, next) => {
    const id = req.params.deliveryAddressId;
    DeliveryAddress.findById(id)
        .then((deliveryAddress) => {
            if (!deliveryAddress) {
                return res.status(404).json({
                    message: 'Delivery address not found'
                })
            }
            DeliveryAddress.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Delivery address deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/deliveryAddresses',
                            body: {
                                customer: 'Customer ID',
                                presentation: 'String',
                                phoneNumber: 'String',
                                address: 'String'
                            }
                        }
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Delivery address delete error',
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