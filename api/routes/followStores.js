const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const FollowStore = require('../models/followStore');
const Store = require('../models/store');
const Customer = require('../models/customer');

router.get('/', (req, res, next) => {
    FollowStore.find()
        .select('customer store')
        .populate('customer', 'name')
        .populate('store', 'storeName')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    followStores: docs.map(doc => {
                        return {
                            _id: doc._id,
                            customer: doc.customer,
                            store: doc.store,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/followStores/' + doc._id
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

router.get('/customer/:customerId', (req, res, next) => {
    const id = req.params.customerId;
    FollowStore.find({
            customer: id
        })
        .select('customer store')
        .populate('customer', 'name')
        .populate('store', 'storeName')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    followStores: docs.map(doc => {
                        return {
                            _id: doc._id,
                            customer: doc.customer,
                            store: doc.store,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/followStores/' + doc._id
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

router.get('/check/:customerId/:storeId', (req, res, next) => {
    FollowStore.findOne({
            customer: req.params.customerId,
            store: req.params.storeId
        })
        .select('customer store')
        .populate('customer', 'name')
        .populate('store', 'storeName')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    followStore: {
                        _id: doc._id,
                        customer: doc.customer,
                        store: doc.store,
                    }
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

router.get('/store/:storeId', (req, res, next) => {
    const id = req.params.storeId;
    FollowStore.find({
            store: id
        })
        .select('customer store')
        .populate('customer', 'name')
        .populate('store', 'storeName')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    followStores: docs.map(doc => {
                        return {
                            _id: doc._id,
                            customer: doc.customer,
                            store: doc.store,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/followStores/' + doc._id
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
    FollowStore.findOne({
            customer: req.body.customerId,
            store: req.body.storeId
        })
        .then(result => {
            if (result) {
                return res.status(404).json({
                    message: 'Customers are following the store',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/followStores/' + result._id
                    }
                })
            }
            Customer.findById(req.body.customerId)
                .then(customer => {
                    if (!customer) {
                        return res.status(404).json({
                            message: 'Customer not found'
                        })
                    }
                    Store.findById(req.body.storeId)
                        .then(store => {
                            if (!store) {
                                return res.status(404).json({
                                    message: 'Store not found'
                                })
                            }
                            const followStore = new FollowStore({
                                _id: new mongoose.Types.ObjectId(),
                                customer: req.body.customerId,
                                store: req.body.storeId
                            })
                            return followStore.save()
                        })
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'Follow store stored',
                                createdFollow: {
                                    _id: result._id,
                                    customer: result.customer,
                                    store: result.store
                                },
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/followStores/' + result._id
                                }
                            });
                        })
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

router.patch('/:followStoreId', (req, res, next) => {
    const id = req.params.followStoreId;
    FollowStore.findById(id)
        .then((followStore) => {
            if (!followStore) {
                return res.status(404).json({
                    message: 'Follow store not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            FollowStore.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json([{
                        message: 'Follow store updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/wishList/' + id
                        }
                    }]);
                }).catch((err) => {
                    res.status(500).json([{
                        message: 'Follow store update error',
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

router.delete('/:customerId/:storeId', (req, res, next) => {
    FollowStore.findOne({
            customer: req.params.customerId,
            store: req.params.storeId
        })
        .then((followStore) => {
            if (!followStore) {
                return res.status(404).json({
                    message: 'Follow store not found'
                })
            }
            FollowStore.deleteOne({
                    customer: req.params.customerId,
                    store: req.params.storeId
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Follow store deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/followStores',
                            body: {
                                customerId: 'Customer ID',
                                storeId: 'Store ID'
                            }
                        }
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Follow store delete error',
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