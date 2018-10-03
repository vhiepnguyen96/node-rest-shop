const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ReviewStore = require('../models/reviewStore');
const Customer = require('../models/customer');
const Store = require('../models/store');
const RatingLevel = require('../models/ratingLevel');

router.get('/', (req, res, next) => {
    ReviewStore.find()
        .select('_id customer store ratingLevel review dateReview')
        .populate('customer', '_id name')
        .populate('store', '_id storeName')
        .populate('ratingLevel', '_id ratingLevel description')
        .exec()
        .then((docs) => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    reviewStores: docs.map(doc => {
                        return {
                            reviewStoreId: doc._id,
                            customer: doc.customer,
                            store: doc.store,
                            ratingLevel: doc.ratingLevel,
                            review: doc.review,
                            dateReview: doc.dateReview,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/reviewStores/' + doc._id
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

router.get('/:reviewStoreId', (req, res, next) => {
    const id = req.params.reviewStoreId;
    ReviewStore.findById(id)
        .select('_id customer store ratingLevel review dateReview')
        .populate('customer', '_id name')
        .populate('store', '_id storeName')
        .populate('ratingLevel', '_id ratingLevel description')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    reviewStore: {
                        reviewStoreId: doc._id,
                        customer: doc.customer,
                        store: doc.store,
                        ratingLevel: doc.ratingLevel,
                        review: doc.review,
                        dateReview: doc.dateReview,
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all reviews at: http://localhost:3000/reviewStores'
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
    const id = req.params.customerId;
    Customer.findById(id)
        .then(customer => {
            if (!customer) {
                return res.status(404).json({
                    message: 'Customer not found'
                })
            }
            ReviewStore.find({
                    customer: id
                })
                .select('_id customer store ratingLevel review dateReview')
                .populate('customer', '_id name')
                .populate('store', '_id storeName')
                .populate('ratingLevel', '_id ratingLevel description')
                .exec()
                .then(docs => {
                    console.log(docs);
                    res.status(200).json({
                        count: docs.length,
                        reviewStores: docs.map(doc => {
                            return {
                                reviewStoreId: doc._id,
                                customer: doc.customer,
                                store: doc.store,
                                ratingLevel: doc.ratingLevel,
                                review: doc.review,
                                dateReview: doc.dateReview,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/reviewStores/' + doc._id
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

router.get('/store/:storeId', (req, res, next) => {
    const id = req.params.storeId;
    Store.findById(id)
        .then(store => {
            if (!store) {
                return res.status(404).json({
                    message: 'Store not found'
                })
            }
            ReviewStore.find({
                    store: id
                })
                .select('_id customer store ratingLevel review dateReview')
                .populate('customer', '_id name')
                .populate('store', '_id storeName')
                .populate('ratingLevel', '_id ratingLevel description')
                .exec()
                .then(docs => {
                    console.log(docs);
                    res.status(200).json({
                        count: docs.length,
                        reviewStores: docs.map(doc => {
                            return {
                                reviewStoreId: doc._id,
                                customer: doc.customer,
                                store: doc.store,
                                ratingLevel: doc.ratingLevel,
                                review: doc.review,
                                dateReview: doc.dateReview,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/reviewStores/' + doc._id
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
                    RatingLevel.findById(req.body.ratingLevelId)
                        .then(rating => {
                            if (!rating) {
                                return res.status(404).json({
                                    message: 'Rating level not found'
                                })
                            }
                            const reviewStore = new ReviewStore({
                                _id: new mongoose.Types.ObjectId(),
                                customer: req.body.customerId,
                                store: req.body.storeId,
                                ratingLevel: req.body.ratingLevelId,
                                review: req.body.review,
                                dateReview: new Date()
                            })
                            return reviewStore.save()
                        })
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'Review store saved',
                                createdReview: {
                                    reviewStoreId: result._id,
                                    customer: result.customer,
                                    store: result.store,
                                    ratingLevel: result.ratingLevel,
                                    review: result.review,
                                    dateReview: result.dateReview,
                                },
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/reviewStores/' + result._id
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

router.patch('/:reviewStoreId', (req, res, next) => {
    const id = req.params.reviewStoreId;
    ReviewStore.findById(id)
        .then((review) => {
            if (!review) {
                return res.status(404).json({
                    message: 'Review store not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            ReviewStore.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Review store updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/reviewStores/' + id
                        }
                    });
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Review store update error',
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

router.delete('/:reviewStoreId', (req, res, next) => {
    const id = req.params.reviewStoreId;
    ReviewStore.findById(id)
        .then((review) => {
            if (!review) {
                return res.status(404).json({
                    message: 'Review store not found'
                })
            }
            ReviewStore.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Review store deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/reviewStores',
                            body: {
                                customerId: 'Customer ID',
                                storeId: 'Store ID',
                                ratingLevelId: 'RatingLevel ID',
                                review: 'String'
                            }
                        }
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Review store delete error',
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