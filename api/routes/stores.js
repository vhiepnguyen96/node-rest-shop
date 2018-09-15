const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Store = require('../models/store');
const Customer = require('../models/customer');

router.get('/', (req, res, next) => {
    Store.find()
        .select('_id customer storeName location phoneNumber createdDate categories')
        .populate('customer', '_id name')
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                stores: docs.map(doc => {
                    return {
                        storeId: doc._id,
                        customer: {
                            customerId: doc.customer._id,
                            name: doc.customer.name
                        },
                        storeName: doc.storeName,
                        location: doc.location,
                        phoneNumber: doc.phoneNumber,
                        createdDate: doc.createdDate,
                        categories: doc.categories,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/stores/' + doc._id
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
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.get('/:storeId', (req, res, next) => {
    const id = req.params.storeId;
    Store.findById(id)
        .select('_id customer storeName location phoneNumber createdDate categories')
        .populate('customer', '_id name')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    store: {
                        storeId: doc._id,
                        customer: {
                            customerId: doc.customer._id,
                            name: doc.customer.name
                        },
                        storeName: doc.storeName,
                        location: doc.location,
                        phoneNumber: doc.phoneNumber,
                        createdDate: doc.createdDate,
                        categories: doc.categories,
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all customer at: http://localhost:3000/customers'
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
    Customer.findById(req.body.customerId)
        .then(customer => {
            if (!customer) {
                return res.status(404).json({
                    message: 'Customer not found'
                })
            }
            const store = new Store({
                _id: new mongoose.Types.ObjectId(),
                customer: req.body.customerId,
                storeName: req.body.storeName,
                location: req.body.location,
                phoneNumber: req.body.phoneNumber,
                createdDate: new Date(),
                categories: req.body.categories
            })
            return store.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Store saved',
                createdStore: {
                    storeId: result._id,
                    customer: result.customer,
                    storeName: result.storeName,
                    location: result.location,
                    phoneNumber: result.phoneNumber,
                    createdDate: result.createdDate,
                    categories: req.body.categories
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/stores/' + result._id
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

router.patch('/:storeId', (req, res, next) => {
    const id = req.params.storeId;
    Store.findById(id)
        .then((store) => {
            if (!store) {
                return res.status(404).json({
                    message: 'Store not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            Store.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Store updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/stores/' + id
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

router.delete('/:storeId', (req, res, next) => {
    const id = req.params.storeId;
    Store.findById(id)
        .then((store) => {
            if (!store) {
                return res.status(404).json({
                    message: 'Store not found'
                })
            }
            Store.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Store deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/stores',
                            body: {
                                customerId: 'Customer ID',
                                storeName: 'String',
                                location: 'String',
                                phoneNumber: 'String',
                                createdDate: 'String',
                                categories: 'Array Category'
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