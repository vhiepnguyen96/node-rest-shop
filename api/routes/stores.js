const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Store = require('../models/store');
const Account = require('../models/account');

router.get('/', (req, res, next) => {
    Store.find()
        .select('_id account storeName location phoneNumber email createdDate categories')
        .populate('account', '_id username')
        .populate('categories.category', 'categoryName')
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                stores: docs.map(doc => {
                    return {
                        _id: doc._id,   
                        account: doc.account,
                        storeName: doc.storeName,
                        location: doc.location,
                        phoneNumber: doc.phoneNumber,
                        email: doc.email,
                        createdDate: doc.createdDate,
                        categories: doc.categories
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
        .select('_id account storeName location phoneNumber email createdDate categories')
        .populate('account', '_id username')
        .populate('categories.category', 'categoryName')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    store: {
                        _id: doc._id,
                        account: doc.account,
                        storeName: doc.storeName,
                        location: doc.location,
                        phoneNumber: doc.phoneNumber,
                        email: doc.email,
                        createdDate: doc.createdDate,
                        categories: doc.categories,
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

router.get('/account/:accountId', (req, res, next) => {
    const id = req.params.accountId;
    Store.findOne({
            account: id
        })
        .select('_id account storeName location phoneNumber email createdDate categories')
        .populate('account', 'username')
        .populate('categories.category', 'categoryName')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    store: {
                        _id: doc._id,
                        account: doc.account,
                        storeName: doc.storeName,
                        location: doc.location,
                        phoneNumber: doc.phoneNumber,
                        email: doc.email,
                        createdDate: doc.createdDate,
                        categories: doc.categories,
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

router.post('/findByName', (req, res, next) => {
    Store.findOne({
            storeName:  req.body.name
        })
        .select('_id account storeName location phoneNumber email createdDate categories')
        .populate('account', 'username')
        .populate('categories.category', 'categoryName')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc);
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
    Account.findById(req.body.accountId)
        .then(account => {
            if (!account) {
                return res.status(404).json({
                    message: 'Account not found'
                })
            }
            const store = new Store({
                _id: new mongoose.Types.ObjectId(),
                account: req.body.accountId,
                storeName: req.body.storeName,
                location: req.body.location,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
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
                    _id: result._id,
                    account: result.account,
                    storeName: result.storeName,
                    location: result.location,
                    phoneNumber: result.phoneNumber,
                    email: result.email,
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
                    res.status(200).json([{
                        message: 'Store updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/stores/' + id
                        }
                    }]);
                }).catch((err) => {
                    res.status(500).json([{
                        message: 'Store update error',
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
                                accountId: 'Customer ID',
                                storeName: 'String',
                                location: 'String',
                                phoneNumber: 'String',
                                email: 'String',
                                categories: 'Array Category'
                            }
                        }
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Store delete error',
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