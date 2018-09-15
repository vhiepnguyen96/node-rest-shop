const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Account = require('../models/account');
const Customer = require('../models/customer');

router.get('/', (req, res, next) => {
    Account.find()
        .select('_id username customer')
        .populate('customer', '_id name')
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                accounts: docs.map(doc => {
                    return {
                        accountId: doc._id,
                        username: doc.username,
                        customer: {
                            customerId: doc.customer._id,
                            name: doc.customer.name
                        },
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/accounts/' + doc.username
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

router.get('/:username', (req, res, next) => {
    Account.findOne({
            username: req.params.username
        })
        .select('_id username password customer')
        .populate('customer', '_id name')
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Account not found'
                })
            }
            res.status(200).json({
                account: {
                    accountId: result._id,
                    username: result.username,
                    password: result.password,
                    customer: {
                        customerId: result.customer._id,
                        name: result.customer.name
                    }
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

router.post('/', (req, res, next) => {
    Customer.findById(req.body.customerId)
        .then(customer => {
            if (!customer) {
                return res.status(404).json({
                    message: 'Customer not found'
                })
            }
            const account = new Account({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                password: req.body.password,
                customer: req.body.customerId
            });
            return account.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created account successfully',
                createdAccount: {
                    accountId: result._id,
                    username: result.username,
                    password: result.password,
                    customer: result.customer,
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/accounts/' + result._id
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

router.patch('/:username', (req, res, next) => {
    const username = req.params.username;
    Account.findOne({
            username: username
        })
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
                    username: username
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Account updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/accounts/' + username
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

router.delete('/:username', (req, res, next) => {
    const username = req.params.username;
    Account.findOne({
            username: username
        })
        .then((account) => {
            if (!account) {
                return res.status(404).json({
                    message: 'Account not found'
                })
            }
            Account.deleteOne({
                    username: req.params.username
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
                })
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });

});

module.exports = router;