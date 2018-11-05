const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Account = require('../models/account');
const Role = require('../models/role');
const Customer = require('../models/customer');
const Store = require('../models/store');

router.get('/', (req, res, next) => {
    Account.find()
        .select('_id username role')
        .populate('role', '_id roleName')
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                accounts: docs.map(doc => {
                    return {
                        _id: doc._id,
                        username: doc.username,
                        role: doc.role,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/accounts/' + doc._id
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

router.get('/:accountId', (req, res, next) => {
    Account.findById(req.params.accountId)
        .select('_id username password role')
        .populate('role', '_id roleName')
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Account not found'
                })
            }
            res.status(200).json({
                account: {
                    _id: result._id,
                    username: result.username,
                    password: result.password,
                    role: result.role
                },
                request: {
                    type: 'GET',
                    description: 'Get all account at: http://localhost:3000/accounts'
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

router.get('/username/:username', (req, res, next) => {
    Account.findOne({
            username: req.params.username
        })
        .select('_id username password role')
        .populate('role', '_id roleName')
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Account not found'
                })
            }
            res.status(200).json({
                account: {
                    _id: result._id,
                    username: result.username,
                    password: result.password,
                    role: result.role
                },
                request: {
                    type: 'GET',
                    description: 'Get all account at: http://localhost:3000/accounts'
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

router.post('/checkLogin', (req, res, next) => {
    Account.findOne({
            username: req.body.username,
            password: req.body.password
        })
        .select('_id username password role')
        .populate('role', '_id roleName')
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Account not found'
                })
            }
            res.status(200).json({
                account: {
                    _id: result._id,
                    username: result.username,
                    password: result.password,
                    role: result.role
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
    Role.findById(req.body.roleId)
        .then(role => {
            if (!role) {
                return res.status(404).json({
                    message: 'Role not found'
                })
            }
            Account.find({username: req.body.username})
                .then(accounts => {
                    if (accounts.length > 0){
                        return res.status(404).json({
                            message: 'Username already in use'
                        })
                    }
                    const account = new Account({
                        _id: new mongoose.Types.ObjectId(),
                        username: req.body.username,
                        password: req.body.password,
                        role: req.body.roleId
                    });
                    return account.save()
                })
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Created account successfully',
                        createdAccount: {
                            _id: result._id,
                            username: result.username,
                            password: result.password,
                            role: result.role,
                        },
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/accounts/' + result._id
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

router.patch('/:accountId', (req, res, next) => {
    const id = req.params.accountId;
    Account.findById(id)
        .then((account) => {
            if (!account) {
                return res.status(404).json({
                    message: 'Account not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            Account.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json([{
                        message: 'Account updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/accounts/' + username
                        }
                    }]);
                }).catch((err) => {
                    res.status(500).json([{
                        message: 'Account update error',
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

router.delete('/:accountId', (req, res, next) => {
    const id = req.params.accountId;
    Account.findById(id)
        .then((account) => {
            if (!account) {
                return res.status(404).json({
                    message: 'Account not found'
                })
            }
            Customer.find({
                    account: id
                })
                .then(docs => {
                    if (docs.length > 0) {
                        return res.status(500).json({
                            message: 'Account is already used',
                        })
                    }
                    Store.find({
                            account: id
                        })
                        .then(docs => {
                            if (docs.length > 0) {
                                return res.status(500).json({
                                    message: 'Account is already used',
                                })
                            }
                            Account.deleteOne({
                                    _id: id
                                })
                                .exec()
                                .then(result => {
                                    res.status(200).json({
                                        message: 'Account deleted',
                                        request: {
                                            type: 'POST',
                                            url: 'http://localhost:3000/accounts',
                                            body: {
                                                username: 'String',
                                                password: 'String',
                                                customer: 'Customer ID'
                                            }
                                        }
                                    })
                                }).catch((err) => {
                                    res.status(500).json({
                                        message: 'Account delete error',
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