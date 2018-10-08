const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ProductImage = require('../models/productImage');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    ProductImage.find()
        .select('_id product imageList')
        .exec()
        .then((docs) => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    images: docs.map(doc => {
                        return {
                            _id: doc._id,
                            productId: doc.product,
                            imageList: doc.imageList,
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
        .select('_id product imageList')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    image: {
                        _id: doc._id,
                        productId: doc.product,
                        imageList: doc.imageList,
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
    ProductImage.findOne({
            product: id
        })
        .select('_id product imageList')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    _id: doc._id,
                    productId: doc.product,
                    imageList: doc.imageList,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/productImages/' + doc._id
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

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            ProductImage.findOne({
                    product: req.body.productId
                })
                .then(result => {
                    if (result) {
                        return res.status(500).json({
                            message: 'Image list of product is already',
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/productImages/' + result._id
                            }
                        })
                    }
                    const productImage = new ProductImage({
                        _id: new mongoose.Types.ObjectId(),
                        product: req.body.productId,
                        imageList: req.body.imageList
                    })
                    return productImage.save()
                })
                .then(doc => {
                    console.log(doc);
                    res.status(201).json({
                        message: 'Product image saved',
                        createdProductImage: {
                            _id: doc._id,
                            productId: doc.product,
                            imageList: doc.imageList,
                        },
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/productImages/' + doc._id
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
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Product image update error',
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
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Product image delete error',
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