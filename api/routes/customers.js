const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Customer = require('../models/customer');
const Account = require('../models/account');

router.get('/', (req, res, next) => {
    Customer.find()
        .select('_id account name gender email phoneNumber')
        .populate('account', '_id username')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                customers: docs.map(doc => {
                    return {
                        customerId: doc._id,
                        account: doc.account,
                        name: doc.name,
                        gender: doc.gender,
                        email: doc.email,
                        phoneNumber: doc.phoneNumber,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/customers/' + doc._id
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
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.get('/:customerId', (req, res, next) => {
    const id = req.params.customerId;
    Customer.findById(id)
        .select('_id account name gender email phoneNumber')
        .populate('account', '_id username')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    customer: {
                        customerId: doc._id,
                        account: doc.account,
                        name: doc.name,
                        gender: doc.gender,
                        email: doc.email,
                        phoneNumber: doc.phoneNumber,
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all customer at: http://localhost:3000/customers'
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

router.get('/account/:accountId', (req, res, next) => {
    const id = req.params.accountId;
    Customer.findOne({account: id})
        .select('_id account name gender email phoneNumber')
        .populate('account', '_id username')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    customer: {
                        customerId: doc._id,
                        account: doc.account,
                        name: doc.name,
                        gender: doc.gender,
                        email: doc.email,
                        phoneNumber: doc.phoneNumber,
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
    Account.findById(req.body.accountId)
        .then(account => {
            if (!account) {
                return res.status(404).json({
                    message: 'Account not found'
                })
            }
            Customer.findOne({
                    account: req.body.accountId
                })
                .then(result => {
                    if (result) {
                        return res.status(500).json({
                            message: 'Account has been used'
                        })
                    }
                    const customer = new Customer({
                        _id: new mongoose.Types.ObjectId(),
                        account: req.body.accountId,
                        name: req.body.name,
                        gender: req.body.gender,
                        email: req.body.email,
                        phoneNumber: req.body.phoneNumber
                    })
                    return customer.save()
                })
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Customer stored',
                        createdCustomer: {
                            customerId: result._id,
                            account: result.account,
                            name: result.name,
                            gender: result.gender,
                            email: result.email,
                            phoneNumber: result.phoneNumber,
                        },
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/customers/' + result._id
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

router.patch('/:customerId', (req, res, next) => {
    const id = req.params.customerId;
    Customer.findById(id)
        .then((customer) => {
            if (!customer) {
                return res.status(404).json({
                    message: 'Customer not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            Customer.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Customer updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/customers/' + id
                        }
                    });
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Customer update error',
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

router.delete('/:customerId', (req, res, next) => {
    const id = req.params.customerId;
    Customer.findById(id)
        .then((customer) => {
            if (!customer) {
                return res.status(404).json({
                    message: 'Customer not found'
                })
            }
            Customer.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Customer deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/customers',
                            body: {
                                accountId: 'Account ID',
                                name: 'String',
                                gender: 'String',
                                email: 'String',
                                phoneNumber: 'String'
                            }
                        }
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Customer delete error',
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