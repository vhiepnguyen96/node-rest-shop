const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Review = require('../models/review');
const Store = require('../models/store');
const Rating = require('../models/rating');

router.get('/', (req, res, next) => {
    Review.find()
        .select('_id store customerName rating comment dateReview')
        .populate('store', '_id storeName')
        .populate('rating', '_id ratingName')
        .exec()
        .then((docs) => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    reviews: docs.map(doc => {
                        return {
                            reviewId: doc._id,
                            store: doc.store,
                            customerName: doc.customerName,
                            rating: doc.rating,
                            comment: doc.comment,
                            dateReview: doc.dateReview,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/reviews/' + doc._id
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

router.get('/:reviewId', (req, res, next) => {
    const id = req.params.reviewId;
    Review.findById(id)
        .select('_id store customerName rating comment dateReview')
        .populate('store', '_id storeName')
        .populate('rating', '_id ratingName')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    store: {
                        reviewId: doc._id,
                        store: doc.store,
                        customerName: doc.customerName,
                        rating: doc.rating,
                        comment: doc.comment,
                        dateReview: doc.dateReview,
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all reviews at: http://localhost:3000/reviews'
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

router.get('/store/:storeId', (req, res, next) => {
    const id = req.params.storeId;
    Store.findById(id)
        .then(store => {
            if (!store) {
                return res.status(404).json({
                    message: 'Store not found'
                })
            }
            Review.find({
                    store: id
                })
                .select('_id store customerName rating comment dateReview')
                .populate('store', '_id storeName')
                .populate('rating', '_id ratingName')
                .exec()
                .then(docs => {
                    console.log(docs);
                    res.status(200).json({
                        count: docs.length,
                        reviews: docs.map(doc => {
                            return {    
                                reviewId: doc._id,
                                store: doc.store,
                                customerName: doc.customerName,
                                rating: doc.rating,
                                comment: doc.comment,
                                dateReview: doc.dateReview,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/reviews/' + doc._id
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
    Store.findById(req.body.storeId)
        .then(store => {
            if (!store) {
                return res.status(404).json({
                    message: 'Store not found'
                })
            }
            Rating.findById(req.body.ratingId)
                .then(rating => {
                    if (!rating) {
                        return res.status(404).json({
                            message: 'Rating not found'
                        })
                    }
                    const review = new Review({
                        _id: new mongoose.Types.ObjectId(),
                        store: req.body.storeId,
                        customerName: req.body.customerName,
                        rating: req.body.ratingId,
                        comment: req.body.comment,
                        dateReview: new Date()
                    })
                    return review.save()
                })
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Review saved',
                        createdReview: {
                            reviewId: result._id,
                            store: result.store,
                            customerName: result.customerName,
                            rating: result.rating,
                            comment: result.comment,
                            dateReview: result.dateReview
                        },
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/reviews/' + result._id
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
router.patch('/:reviewId', (req, res, next) => {
    const id = req.params.reviewId;
    Review.findById(id)
        .then((review) => {
            if (!review) {
                return res.status(404).json({
                    message: 'Review not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            Review.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Review updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/reviews/' + id
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

router.delete('/:reviewId', (req, res, next) => {
    const id = req.params.reviewId;
    Review.findById(id)
        .then((review) => {
            if (!review) {
                return res.status(404).json({
                    message: 'Review not found'
                })
            }
            Review.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Review deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/reviews',
                            body: {
                                storeId: 'Store ID',
                                customerName: 'String',
                                ratingId: 'Rating ID',
                                comment: 'String'
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