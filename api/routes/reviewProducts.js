const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ReviewProduct = require('../models/reviewProduct');
const Customer = require('../models/customer');
const Product = require('../models/product');
const RatingStar = require('../models/ratingStar');

router.get('/', (req, res, next) => {
    ReviewProduct.find()
        .select('_id customer product ratingStar review dateReview')
        .populate('customer', '_id name')
        .populate('product', '_id productName')
        .populate('ratingStar', '_id ratingStar description')
        .exec()
        .then((docs) => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    reviewStores: docs.map(doc => {
                        return {
                            _id: doc._id,
                            customer: doc.customer,
                            product: doc.product,
                            ratingStar: doc.ratingStar,
                            review: doc.review,
                            dateReview: doc.dateReview,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/reviewProducts/' + doc._id
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

router.get('/:reviewProductId', (req, res, next) => {
    const id = req.params.reviewProductId;
    ReviewProduct.findById(id)
        .select('_id customer product ratingStar review dateReview')
        .populate('customer', '_id name')
        .populate('product', '_id productName')
        .populate('ratingStar', '_id ratingStar description')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    reviewProduct: {
                        _id: doc._id,
                        customer: doc.customer,
                        product: doc.product,
                        ratingStar: doc.ratingStar,
                        review: doc.review,
                        dateReview: doc.dateReview,
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all reviews at: http://localhost:3000/reviewProducts'
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
            ReviewProduct.find({
                    customer: id
                })
                .select('_id customer product ratingStar review dateReview')
                .populate('customer', '_id name')
                .populate('product', '_id productName')
                .populate('ratingStar', '_id ratingStar description')
                .exec()
                .then(docs => {
                    console.log(docs);
                    res.status(200).json({
                        count: docs.length,
                        reviewProducts: docs.map(doc => {
                            return {
                                _id: doc._id,
                                customer: doc.customer,
                                product: doc.product,
                                ratingStar: doc.ratingStar,
                                review: doc.review,
                                dateReview: doc.dateReview,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/reviewProducts/' + doc._id
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

router.get('/product/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            ReviewProduct.find({
                    product: id
                })
                .select('_id customer product ratingStar review dateReview')
                .populate('customer', '_id name')
                .populate('product', '_id productName')
                .populate('ratingStar', '_id ratingStar description')
                .exec()
                .then(docs => {
                    console.log(docs);
                    res.status(200).json({
                        count: docs.length,
                        reviewProducts: docs.map(doc => {
                            return {
                                _id: doc._id,
                                customer: doc.customer,
                                product: doc.product,
                                ratingStar: doc.ratingStar,
                                review: doc.review,
                                dateReview: doc.dateReview,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/reviewProducts/' + doc._id
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
            Product.findById(req.body.productId)
                .then(product => {
                    if (!product) {
                        return res.status(404).json({
                            message: 'Product not found'
                        })
                    }
                    RatingStar.findById(req.body.ratingStarId)
                        .then(rating => {
                            if (!rating) {
                                return res.status(404).json({
                                    message: 'Rating star not found'
                                })
                            }
                            const reviewProduct = new ReviewProduct({
                                _id: new mongoose.Types.ObjectId(),
                                customer: req.body.customerId,
                                product: req.body.productId,
                                ratingStar: req.body.ratingStarId,
                                review: req.body.review,
                                dateReview: new Date()
                            })
                            return reviewProduct.save()
                        })
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'Review product saved',
                                createdReviewProduct: {
                                    _id: result._id,
                                    customer: result.customer,
                                    product: result.product,
                                    ratingStar: result.ratingStar,
                                    review: result.review,
                                    dateReview: result.dateReview,
                                },
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/reviewProducts/' + result._id
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

router.patch('/:reviewProductId', (req, res, next) => {
    const id = req.params.reviewProductId;
    ReviewProduct.findById(id)
        .then((review) => {
            if (!review) {
                return res.status(404).json({
                    message: 'Review product not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            ReviewProduct.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json([{
                        message: 'Review product updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/reviewProducts/' + id
                        }
                    }]);
                }).catch((err) => {
                    res.status(500).json([{
                        message: 'Review product update error',
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

router.delete('/:reviewProductId', (req, res, next) => {
    const id = req.params.reviewProductId;
    ReviewProduct.findById(id)
        .then((review) => {
            if (!review) {
                return res.status(404).json({
                    message: 'Review product not found'
                })
            }
            ReviewProduct.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Review product deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/reviewProducts',
                            body: {
                                customerId: 'Customer ID',
                                productId: 'Product ID',
                                ratingLevelId: 'RatingLevel ID',
                                review: 'String'
                            }
                        }
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Review product delete error',
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

router.delete('/product/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .then((product) => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            ReviewProduct.deleteMany({
                    product: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Review product of ' + id + ' deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/reviewProducts',
                            body: {
                                customerId: 'Customer ID',
                                productId: 'Product ID',
                                ratingLevelId: 'RatingLevel ID',
                                review: 'String'
                            }
                        }
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Review product delete error',
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