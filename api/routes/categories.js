const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Category = require('../models/category');
const ProductType = require('../models/productType');

router.get('/', (req, res, next) => {
    Category.find()
        .select('_id categoryName')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    categories: docs.map(doc => {
                        return {
                            _id: doc._id,
                            categoryName: doc.categoryName,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/categories/' + doc._id
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

router.get('/:categoryId', (req, res, next) => {
    Category.findById(req.params.categoryId)
        .select('_id categoryName')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    category: {
                        _id: doc._id,
                        categoryName: doc.categoryName,
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all categories at: http://localhost:3000/categories'
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
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        categoryName: req.body.categoryName
    });
    category.save()
        .then((result) => {
            console.log(result);
            res.status(201).json({
                message: 'Created category successfully',
                createdCategory: {
                    _id: result._id,
                    categoryName: result.categoryName,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/categories/' + result._id
                    }
                }
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.patch('/:categoryId', (req, res, next) => {
    const id = req.params.categoryId;
    Category.findById(id)
        .then((category) => {
            if (!category) {
                return res.status(404).json({
                    message: 'Category not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            Category.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Category updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/categories/' + id
                        }
                    });
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Category update error',
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

router.delete('/:categoryId', (req, res, next) => {
    const id = req.params.categoryId;
    ProductType.find({
            category: req.params.categoryId
        })
        .then((docs) => {
            if (docs.length > 0) {
                return res.status(500).json({
                    message: 'Category is already used',
                    result: docs
                })
            }
            Category.findById(id)
                .then((category) => {
                    if (!category) {
                        return res.status(404).json({
                            message: 'Category not found'
                        })
                    }
                    Category.deleteOne({
                            _id: id
                        })
                        .exec()
                        .then(result => {
                            res.status(200).json({
                                message: 'Category deleted',
                                request: {
                                    type: 'POST',
                                    url: 'http://localhost:3000/categories',
                                    body: {
                                        categoryName: 'String'
                                    }
                                }
                            });
                        }).catch((err) => {
                            res.status(500).json({
                                message: 'Category delete error',
                                error: err
                            })
                        });
                })
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;