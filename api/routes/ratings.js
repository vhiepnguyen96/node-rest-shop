const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Rating = require('../models/rating');

router.get('/', (req, res, next) => {
    Rating.find()
        .select('_id ratingName description')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    ratings: docs.map(doc => {
                        return {
                            ratingId: doc._id,
                            ratingName: doc.ratingName,
                            description: doc.description,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/ratings/' + doc._id
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

router.get('/:ratingId', (req, res, next) => {
    Rating.findById(req.params.ratingId)
        .select('_id ratingName description')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    rating: {
                        ratingId: doc._id,
                        ratingName: doc.ratingName,
                        description: doc.description,
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all rating at: http://localhost:3000/ratings'
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
    const rating = new Rating({
        _id: new mongoose.Types.ObjectId(),
        ratingName: req.body.ratingName,
        description: req.body.description
    });
    rating.save()
        .then((result) => {
            console.log(result);
            res.status(201).json({
                message: 'Created rating successfully',
                createdRating: {
                    ratingId: result._id,
                    ratingName: result.ratingName,
                    description: result.description,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/ratings/' + result._id
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

router.patch('/:ratingId', (req, res, next) => {
    const id = req.params.ratingId;
    Rating.findById(id)
        .then((rating) => {
            if (!rating) {
                return res.status(404).json({
                    message: 'Rating not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            Rating.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Rating updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/ratings/' + id
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

router.delete('/:ratingId', (req, res, next) => {
    const id = req.params.ratingId;
    Rating.findById(id)
        .then((rating) => {
            if (!rating) {
                return res.status(404).json({
                    message: 'Ratings not found'
                })
            }
            Rating.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Rating deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/ratings',
                            body: {
                                ratingName: 'String',
                                description: 'String'
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