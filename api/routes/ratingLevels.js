const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const RatingLevel = require('../models/ratingLevel');

router.get('/', (req, res, next) => {
    RatingLevel.find()
        .select('_id ratingLevel description')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    ratingLevels: docs.map(doc => {
                        return {
                            ratingLevelId: doc._id,
                            ratingLevel: doc.ratingLevel,
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

router.get('/:ratingLevelId', (req, res, next) => {
    RatingLevel.findById(req.params.ratingLevelId)
        .select('_id ratingLevel description')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    rating: {
                        ratingLevelId: doc._id,
                        ratingLevel: doc.ratingLevel,
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
    RatingLevel.findOne({ratingLevel: req.body.ratingLevel})
        .then(rating => {
            if (rating) {
                return res.status(404).json({
                    message: 'Rating level already exists'
                })
            }
            const ratingLevel = new RatingLevel({
                _id: new mongoose.Types.ObjectId(),
                ratingLevel: req.body.ratingLevel,
                description: req.body.description
            });
            ratingLevel.save()
                .then((result) => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Created rating level successfully',
                        createdRatingLevel: {
                            ratingLevelId: result._id,
                            ratingLevel: result.ratingLevel,
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

router.patch('/:ratingLevelId', (req, res, next) => {
    const id = req.params.ratingLevelId;
    RatingLevel.findById(id)
        .then((rating) => {
            if (!rating) {
                return res.status(404).json({
                    message: 'Rating level not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            RatingLevel.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Rating level updated'
                    });
                })
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.delete('/:ratingLevelId', (req, res, next) => {
    const id = req.params.ratingLevelId;
    RatingLevel.findById(id)
        .then((rating) => {
            if (!rating) {
                return res.status(404).json({
                    message: 'Rating level not found'
                })
            }
            RatingLevel.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Rating level deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/ratings',
                            body: {
                                ratingLevel: 'Number',
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