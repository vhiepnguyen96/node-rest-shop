const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ProductImage = require('../models/productImage');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    ProductImage.find()
        .select('_id product imageURL')
        .exec()
        .then((docs) => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    images: docs.map(doc => {
                        return {
                            productImageId: doc._id,
                            productId: doc.product,
                            imageURL: doc.imageURL,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/productImages/' + doc._id
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

router.get('/:productImageId', (req, res, next) => {
    const id = req.params.productImageId;
    ProductImage.findById(id)
        .select('_id product imageURL')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    image: {
                        productImageId: doc._id,
                        productId: doc.product,
                        imageURL: doc.imageURL,
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all product image at: http://localhost:3000/productImages'
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

router.get('/product/:productId', (req, res, next) => {
    const id = req.params.productId;
    ProductImage.find({
            product: id
        })
        .select('_id product imageURL')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    images: docs.map(doc => {
                        return {
                            productImageId: doc._id,
                            productId: doc.product,
                            imageURL: doc.imageURL,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/productImages/' + doc._id
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
    Product.findById(req.body.productId)
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            const productImage = new ProductImage({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                imageURL: req.body.imageURL
            })
            return productImage.save()
        })
        .then(doc => {
            console.log(doc);
            res.status(201).json({
                message: 'Product image saved',
                createdProductImage: {
                    productImageId: doc._id,
                    productId: doc.product,
                    imageURL: doc.imageURL,
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/productImages/' + doc._id
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

router.patch('/:productImageId', (req, res, next) => {
    const id = req.params.productImageId;
    ProductImage.findById(id)
        .then((productImage) => {
            if (!productImage) {
                return res.status(404).json({
                    message: 'Product image not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            ProductImage.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Product image updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/productImages/' + id
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

router.delete('/:productImageId', (req, res, next) => {
    const id = req.params.productImageId;
    ProductImage.findById(id)
        .then((productImage) => {
            if (!productImage) {
                return res.status(404).json({
                    message: 'Product image not found'
                })
            }
            ProductImage.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Product image deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/productImages',
                            body: {
                                productId: 'Product ID',
                                imageURL: 'String'
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