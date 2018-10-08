const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const FilterType = require('../models/filterType');
const ProductType = require('../models/productType');

router.get('/', (req, res, next) => {
    FilterType.find()
        .select('_id filterName filterItems')
        .exec()
        .then((docs) => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    filterTypes: docs.map(doc => {
                        return {
                            _id: doc._id,
                            filterName: doc.filterName,
                            filterItems: doc.filterItems,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/filterTypes/' + doc._id
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

router.get('/:filterTypeId', (req, res, next) => {
    const id = req.params.filterTypeId;
    FilterType.findById(id)
        .select('_id filterName filterItems')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    filterType: {
                        _id: doc._id,
                        filterName: doc.filterName,
                        filterItems: doc.filterItems
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all filter type at: http://localhost:3000/filterTypes'
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
    FilterType.findOne({filterName: req.body.filterName})
        .then(result => {
            if (result) {
                return res.status(404).json({
                    message: 'Filter type is already'
                })
            }
            const filterType = new FilterType({
                _id: new mongoose.Types.ObjectId(),
                filterName: req.body.filterName,
                filterItems: req.body.filterItems
            })
            return filterType.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Filter type stored',
                createdFilterType: {
                    _id: result._id,
                    filterName: result.filterName,
                    filterItems: result.filterItems
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/filterTypes/' + result._id
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

router.patch('/:filterTypeId', (req, res, next) => {
    const id = req.params.filterTypeId;
    FilterType.findById(id)
        .then((filterType) => {
            if (!filterType) {
                return res.status(404).json({
                    message: 'Filter type not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            FilterType.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Filter type updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/filterTypes/' + id
                        }
                    });
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Filter type update error',
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

router.delete('/:filterTypeId', (req, res, next) => {
    const id = req.params.filterTypeId;
    FilterType.findById(id)
        .then((filterType) => {
            if (!filterType) {
                return res.status(404).json({
                    message: 'Filter type not found'
                })
            }
            FilterType.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Filter type deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/filterTypes',
                            body: {
                                filterName: 'String',
                                filterItems: 'Array'
                            }
                        }
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Filter type delete error',
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