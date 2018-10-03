const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Role = require('../models/role');
const Customer = require('../models/customer');

router.get('/', (req, res, next) => {
    Role.find()
        .select('_id roleName description')
        .then((docs) => {
            const response = {
                count: docs.length,
                roles: docs.map(doc => {
                    return {
                        roleId: doc._id,
                        roleName: doc.roleName,
                        description: doc.description,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/roles/' + doc._id
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

router.get('/:roleId', (req, res, next) => {
    Role.findById(req.params.roleId)
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Role not found'
                })
            }
            res.status(200).json({
                role: {
                    roleId: result._id,
                    roleName: result.roleName,
                    description: result.description
                },
                request: {
                    type: 'GET',
                    description: 'Get all role at: http://localhost:3000/roles'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.post('/', (req, res, next) => {
    const role = new Role({
        _id: new mongoose.Types.ObjectId(),
        roleName: req.body.roleName,
        description: req.body.description
    });
    role.save()
        .then((result) => {
            console.log(result);
            res.status(201).json({
                message: 'Created role successfully',
                createdRole: {
                    roleId: result._id,
                    roleName: result.roleName,
                    description: result.description,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/roles/' + result._id
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

router.patch('/:roleId', (req, res, next) => {
    const id = req.params.roleId;
    Role.findById(id)
        .then((role) => {
            if (!role) {
                return res.status(404).json({
                    message: 'Role not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            Role.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Role updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/roles/' + id
                        }
                    });
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Role update error',
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

router.delete('/:roleId', (req, res, next) => {
    const id = req.params.roleId;
    Role.findById(id)
        .then((role) => {
            if (!role) {
                return res.status(404).json({
                    message: 'Role not found'
                })
            }
            Customer.find({
                    role: id
                })
                .then(docs => {
                    if (docs.length > 0) {
                        return res.status(500).json({
                            message: 'Role is already used',
                            result: docs
                        })
                    }
                    Role.deleteOne({
                            _id: id
                        })
                        .exec()
                        .then(result => {
                            res.status(200).json({
                                message: 'Role deleted',
                                request: {
                                    type: 'POST',
                                    url: 'http://localhost:3000/roles',
                                    body: {
                                        roleName: 'String',
                                        description: 'String'
                                    }
                                }
                            });
                        }).catch((err) => {
                            res.status(500).json({
                                message: 'Role delete error',
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