const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const SaleOff = require('../models/saleOff');

router.get('/', (req, res, next) => {
    SaleOff.find()
        .select('_id discount dateStart dateEnd')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    saleOffs: docs.map(doc => {
                        return {
                            saleId: doc._id,
                            discount: doc.discount,
                            dateStart: doc.dateStart,
                            dateEnd: doc.dateEnd,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/salesOff/' + doc._id
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

router.get('/:saleId', (req, res, next) => {
    SaleOff.findById(req.params.saleId)
        .select('_id discount dateStart dateEnd')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    saleOff: {
                        saleId: doc._id,
                        discount: doc.discount,
                        dateStart: doc.dateStart,
                        dateEnd: doc.dateEnd,
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all sale off at: http://localhost:3000/salesOff'
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
    const saleOff = new SaleOff({
        _id: new mongoose.Types.ObjectId(),
        discount: req.body.discount,
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd
    });
    saleOff.save()
        .then((result) => {
            console.log(result);
            res.status(201).json({
                message: 'Created sale off successfully',
                createdSaleOff: {
                    saleId: result._id,
                    discount: result.discount,
                    dateStart: result.dateStart,
                    dateEnd: result.dateEnd,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/salesOff/' + result._id
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

router.patch('/:saleId', (req, res, next) => {
    const id = req.params.saleId;
    SaleOff.findById(id)
        .then((saleOff) => {
            if (!saleOff) {
                return res.status(404).json({
                    message: 'Sale off not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            SaleOff.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Sale off updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/salesOff/' + id
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

router.delete('/:saleId', (req, res, next) => {
    const id = req.params.saleId;
    SaleOff.findById(id)
        .then((saleOff) => {
            if (!saleOff) {
                return res.status(404).json({
                    message: 'Sale off not found'
                })
            }
            SaleOff.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Sale off deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/salesOff',
                            body: {
                                discount: 'Number',
                                dateStart: 'Date',
                                dateEnd: 'Date'
                            }
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

module.exports = router;