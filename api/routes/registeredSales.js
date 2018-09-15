const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const RegisteredSale = require('../models/registeredSale');
const Customer = require('../models/customer');

router.get('/', (req, res, next) => {
    RegisteredSale.find()
        .select('_id customer storeName address phoneNumber email registeredDate isApprove')
        .populate('customer', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                registeredSales: docs.map(doc => {
                    return {
                        registeredSalesId: doc._id,
                        customer: doc.customer,
                        storeName: doc.storeName,
                        address: doc.address,
                        phoneNumber: doc.phoneNumber,
                        email: doc.email,
                        registeredDate: doc.registeredDate,
                        isApprove: doc.isApprove == null ? "Đang chờ phê duyệt" : (doc.isApprove ? "Đã được phê duyệt" : "Không được phê duyệt"),
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/registeredSales/' + doc._id
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

router.get('/:registeredSalesId', (req, res, next) => {
    const id = req.params.registeredSalesId;
    RegisteredSale.findById(id)
        .select('_id customer storeName address phoneNumber email registeredDate isApprove')
        .populate('customer', 'name')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    registeredSale: {
                        registeredSalesId: doc._id,
                        customer: doc.customer,
                        storeName: doc.storeName,
                        address: doc.address,
                        phoneNumber: doc.phoneNumber,
                        email: doc.email,
                        registeredDate: doc.registeredDate,
                        isApprove: doc.isApprove == null ? "Đang chờ phê duyệt" : (doc.isApprove ? "Đã được phê duyệt" : "Không được phê duyệt"),
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all registered sale at: http://localhost:3000/registeredSales'
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

router.get('/customer/:customerId', (req, res, next) => {
    RegisteredSale.find({
            customer: req.params.customerId
        })
        .select('_id customer storeName address phoneNumber email registeredDate isApprove')
        .populate('customer', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                registeredSales: docs.map(doc => {
                    return {
                        registeredSalesId: doc._id,
                        customer: doc.customer,
                        storeName: doc.storeName,
                        address: doc.address,
                        phoneNumber: doc.phoneNumber,
                        email: doc.email,
                        registeredDate: doc.registeredDate,
                        isApprove: doc.isApprove == null ? "Đang chờ phê duyệt" : (doc.isApprove ? "Đã được phê duyệt" : "Không được phê duyệt"),
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/registeredSales/' + doc._id
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

router.post('/', (req, res, next) => {
    Customer.findById(req.body.customerId)
        .then(role => {
            if (!role) {
                return res.status(404).json({
                    message: 'Customer not found'
                })
            }
            const registeredSale = new RegisteredSale({
                _id: new mongoose.Types.ObjectId(),
                customer: req.body.customerId,
                storeName: req.body.storeName,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                registeredDate: new Date(),
                isApprove: null
            })
            return registeredSale.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Registered sale stored',
                createdRegisteredSale: {
                    registeredSalesId: result._id,
                    customer: result.customer,
                    storeName: result.storeName,
                    address: result.address,
                    phoneNumber: result.phoneNumber,
                    email: result.email,
                    registeredDate: result.registeredDate,
                    isApprove: "Đang chờ phê duyệt"
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/registeredSales/' + result._id
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

router.patch('/:registeredSalesId', (req, res, next) => {
    const id = req.params.registeredSalesId;
    RegisteredSale.findById(id)
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: 'Registered sale not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            RegisteredSale.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Registered sale updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/registeredSales/' + id
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

router.delete('/:registeredSalesId', (req, res, next) => {
    RegisteredSale.findById(req.params.registeredSalesId)
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: 'Registered sale not found'
                })
            }
            RegisteredSale.deleteOne({
                    _id: req.params.registeredSalesId
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Registered sale deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/registeredSales',
                            body: {
                                customerId: 'Customer ID',
                                storeName: 'String',
                                address: 'String',
                                phoneNumber: 'String',
                                email: 'String'
                            }
                        }
                    })
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;