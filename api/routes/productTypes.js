const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ProductType = require('../models/productType');
const Category = require('../models/category');
const Product = require('../models/product');
const SpecificationType = require('../models/specificationType');

router.get('/', (req, res, next) => {
    ProductType.find()
        .select('_id productTypeName imageURL category')
        .populate('category', '_id categoryName')
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                productTypes: docs.map(doc => {
                    return {
                        _id: doc._id,
                        productTypeName: doc.productTypeName,
                        imageURL: doc.imageURL,
                        category: doc.category,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/productTypes/' + doc._id
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

router.get('/:productTypeId', (req, res, next) => {
    const id = req.params.productTypeId;
    ProductType.findById(id)
        .select('_id productTypeName imageURL category')
        .populate('category', '_id categoryName')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    productType: {
                        _id: doc._id,
                        productTypeName: doc.productTypeName,
                        imageURL: doc.imageURL,
                        category: doc.category
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all product type at: http://localhost:3000/productTypes'
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

router.get('/category/:categoryId', (req, res, next) => {
    const id = req.params.categoryId;
    Category.findById(id)
        .then(category => {
            if (!category) {
                return res.status(404).json({
                    message: 'Category not found'
                })
            }
            ProductType.find({
                    category: id
                })
                .select('_id productTypeName imageURL category')
                .populate('category', '_id categoryName')
                .exec()
                .then(docs => {
                    console.log(docs);
                    res.status(200).json({
                        count: docs.length,
                        productTypes: docs.map(doc => {
                            return {
                                _id: doc._id,
                                productTypeName: doc.productTypeName,
                                imageURL: doc.imageURL,
                                category: doc.category,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/productTypes/' + doc._id
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
    Category.findById(req.body.categoryId)
        .then(category => {
            if (!category) {
                return res.status(404).json({
                    message: 'Category not found'
                })
            }
            const productType = new ProductType({
                _id: new mongoose.Types.ObjectId(),
                productTypeName: req.body.productTypeName,
                imageURL: req.body.imageURL,
                category: req.body.categoryId
            })
            return productType.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Product type saved',
                createdProductType: {
                    _id: result._id,
                    productTypeName: result.productTypeName,
                    imageURL: result.imageURL,
                    category: result.category
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/productTypes/' + result._id
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

router.patch('/:productTypeId', (req, res, next) => {
    const id = req.params.productTypeId;
    ProductType.findById(id)
        .then((productType) => {
            if (!productType) {
                return res.status(404).json({
                    message: 'Product type not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            ProductType.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json([{
                        message: 'Product type updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/productTypes/' + id
                        }
                    }]);
                }).catch((err) => {
                    res.status(500).json([{
                        message: 'Product type update error',
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

router.delete('/:productTypeId', (req, res, next) => {
    const id = req.params.productTypeId;
    ProductType.findById(id)
        .then((productType) => {
            if (!productType) {
                return res.status(404).json({
                    message: 'Product type not found'
                })
            }
            Product.find({
                    productType: id
                })
                .then(docs => {
                    if (docs.length > 0) {
                        return res.status(500).json({
                            message: 'Product type already used'
                        })
                    }
                    SpecificationType.find({
                            productType: id
                        })
                        .then(docs => {
                            if (docs.length > 0) {
                                return res.status(500).json({
                                    message: 'Product type already used'
                                })
                            }
                            ProductType.deleteOne({
                                    _id: id
                                })
                                .exec()
                                .then(result => {
                                    res.status(200).json({
                                        message: 'Product type deleted',
                                        request: {
                                            type: 'POST',
                                            url: 'http://localhost:3000/productTypes',
                                            body: {
                                                productTypeName: 'String',
                                                categoryId: 'Category ID'
                                            }
                                        }
                                    })
                                }).catch((err) => {
                                    res.status(500).json({
                                        message: 'Product type delete error',
                                        error: err
                                    })
                                });
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