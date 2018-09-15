const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const WishList = require('../models/wishList');
const Customer = require('../models/customer');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    WishList.find()
        .select('customer product')
        .populate('customer', 'name')
        .populate('product', 'productName')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    followStores: docs.map(doc => {
                        return {
                            wishListId: doc._id,
                            customer: doc.customer,
                            product: doc.product,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/wishList/' + doc._id
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

router.get('/:wishListId', (req, res, next) => {
    WishList.findById(req.params.wishListId)
        .select('customer product')
        .populate('customer', 'name')
        .populate('product', 'productName')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    wishList: {
                        wishListId: doc._id,
                        customer: doc.customer,
                        product: doc.product,
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all wish list at: http://localhost:3000/wishList'
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
    WishList.find({
            customer: id
        })
        .select('customer product')
        .populate('customer', 'name')
        .populate('product', 'productName')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    wishList: docs.map(doc => {
                        return {
                            wishListId: doc._id,
                            customer: doc.customer,
                            product: doc.product,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/wishList/' + doc._id
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
    WishList.findOne({
            customer: req.body.customerId,
            product: req.body.productId
        })
        .then(result => {
            if (result) {
                return res.status(500).json({
                    message: 'Product already exists in the wish list',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/wishList/' + result._id
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
                    Product.findById(req.body.productId)
                        .then(product => {
                            if (!product) {
                                return res.status(404).json({
                                    message: 'Product not found'
                                })
                            }
                            const wishList = new WishList({
                                _id: new mongoose.Types.ObjectId(),
                                customer: req.body.customerId,
                                product: req.body.productId
                            })
                            return wishList.save()
                        })
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'Wish list stored',
                                createdWishList: {
                                    followStoreId: result._id,
                                    customer: result.customer,
                                    product: result.product
                                },
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/wishList/' + result._id
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

router.patch('/:customerId', (req, res, next) => {

});

router.delete('/:customerId/:productId', (req, res, next) => {
    WishList.findOne({
        customer: req.params.customerId,
        product: req.params.productId
    })
    .then((wishList) => {
        if (!wishList) {
            return res.status(404).json({
                message: 'Wish list not found'
            })
        }
        WishList.deleteOne({
                customer: req.params.customerId,
                product: req.params.productId
            })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Wish list deleted',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/wishList',
                        body: {
                            customerId: 'Customer ID',
                            productId: 'Product ID'
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