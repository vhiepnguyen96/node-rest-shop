const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const RatingStar = require('../models/ratingStar');

router.get('/', (req, res, next) => {
    RatingStar.find()
        .select('_id ratingStar description')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    ratingStars: docs.map(doc => {
                        return {
                            ratingStarId: doc._id,
                            ratingStar: doc.ratingStar,
                            description: doc.description
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

router.get('/:ratingStarId', (req, res, next) => {
    RatingStar.findById(req.params.ratingStarId)
        .select('_id ratingStar description')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    rating: {
                        ratingStarId: doc._id,
                        ratingStar: doc.ratingStar,
                        description: doc.description,
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
    RatingStar.findOne({ratingStar: req.body.ratingStar})
        .then(rating => {
            if (rating) {
                return res.status(404).json({
                    message: 'Rating star already exists'
                })
            }
            const ratingStar = new RatingStar({
                _id: new mongoose.Types.ObjectId(),
                ratingStar: req.body.ratingStar,
                description: req.body.description
            });
            ratingStar.save()
                .then((result) => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Created rating star successfully',
                        createdRatingStar: {
                            ratingStarId: result._id,
                            ratingStar: result.ratingStar,
                            description: result.description
                        }
                    });
                })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.patch('/:ratingStarId', (req, res, next) => {
    const id = req.params.ratingStarId;
    RatingStar.findById(id)
        .then((rating) => {
            if (!rating) {
                return res.status(404).json({
                    message: 'Rating star not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            RatingStar.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Rating star updated'
                    });
                })
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.delete('/:ratingStarId', (req, res, next) => {
    const id = req.params.ratingStarId;
    RatingStar.findById(id)
        .then((rating) => {
            if (!rating) {
                return res.status(404).json({
                    message: 'Rating star not found'
                })
            }
            RatingStar.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Rating star deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/ratingStars',
                            body: {
                                ratingStar: 'Number',
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