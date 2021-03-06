const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');
const ProductType = require('../models/productType');
const Store = require('../models/store');
const SaleOff = require('../models/saleOff');
const ProductImage = require('../models/productImage');

var perPage = 10;

router.get('/', (req, res, next) => {
    Product.find()
        .select('_id productType store productName price quantity saleOff specifications overviews')
        .populate('productType', 'productTypeName')
        .populate('store', 'storeName location')
        .populate('saleOff', 'discount dateStart dateEnd')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    products: docs.map(doc => {
                        return {
                            _id: doc._id,
                            productType: doc.productType,
                            store: doc.store,
                            productName: doc.productName,
                            price: doc.price,
                            quantity: doc.quantity,
                            saleOff: doc.saleOff,
                            specifications: doc.specifications,
                            overviews: doc.overviews,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/products/' + doc._id
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

router.get('/onSale', (req, res, next) => {
    Product.find({
            saleOff: {
                $ne: null
            }
        })
        .select('_id productType store productName price quantity saleOff specifications overviews')
        .populate('productType', 'productTypeName')
        .populate('store', 'storeName location')
        .populate('saleOff', 'discount dateStart dateEnd')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    products: docs.map(doc => {
                        return {
                            _id: doc._id,
                            productType: doc.productType,
                            store: doc.store,
                            productName: doc.productName,
                            price: doc.price,
                            quantity: doc.quantity,
                            saleOff: doc.saleOff,
                            specifications: doc.specifications,
                            overviews: doc.overviews,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/products/' + doc._id
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

router.get('/onSale/:page', (req, res, next) => {
    var page = req.params.page || 1
    Product.find({
            saleOff: {
                $ne: null
            }
        })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .select('_id productType store productName price quantity saleOff specifications overviews')
        .populate('productType', 'productTypeName')
        .populate('store', 'storeName location')
        .populate('saleOff', 'discount dateStart dateEnd')
        .exec()
        .then(products => {
            console.log(products);
            Product.countDocuments({
                saleOff: {
                    $ne: null
                }
            }).exec(function (err, count) {
                res.status(200).json({
                    current: page,
                    pages: Math.ceil(count / perPage),
                    products: products
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.post('/findByName', (req, res, next) => {
    Product.find({
            productName: {
                '$regex': req.body.name,
                '$options': 'i'
            }
        })
        .select('_id productType store productName price quantity saleOff specifications overviews')
        .populate('productType', 'productTypeName')
        .populate('store', 'storeName location')
        .populate('saleOff', 'discount dateStart dateEnd')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    products: docs
                })
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
        });
});

router.get('/:productId', (req, res, next) => {
    Product.findById(req.params.productId)
        .select('_id productType store productName price quantity saleOff specifications overviews')
        .populate('productType', 'productTypeName')
        .populate('store', 'storeName location')
        .populate('saleOff', 'discount dateStart dateEnd')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    product: {
                        _id: doc._id,
                        productType: doc.productType,
                        store: doc.store,
                        productName: doc.productName,
                        price: doc.price,
                        quantity: doc.quantity,
                        saleOff: doc.saleOff,
                        specifications: doc.specifications,
                        overviews: doc.overviews,
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all product at: http://localhost:3000/products'
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

router.get('/getStore/:productId', (req, res, next) => {
    Product.findById(req.params.productId)
        .select('_id store')
        .populate('store', 'storeName location')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    store: doc.store
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

router.get('/store/:storeId', (req, res, next) => {
    Product.find({
            store: req.params.storeId
        })
        .select('_id productType store productName price quantity saleOff specifications overviews')
        .populate('productType', 'productTypeName')
        .populate('store', 'storeName location')
        .populate('saleOff', 'discount dateStart dateEnd')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    products: docs
                })
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
        });
});



router.get('/productType/:productTypeId', (req, res, next) => {
    Product.find({
            productType: req.params.productTypeId
        })
        .select('_id productType store productName price quantity saleOff specifications overviews')
        .populate('productType', 'productTypeName')
        .populate('store', 'storeName location')
        .populate('saleOff', 'discount dateStart dateEnd')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    length: docs.length,
                    products: docs
                })
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
        });
});

router.get('/store/productType/:storeId/:productTypeId', (req, res, next) => {
    Product.find({
            store: req.params.storeId,
            productType: req.params.productTypeId
        })
        .select('_id productType store productName price quantity saleOff specifications overviews')
        .populate('productType', 'productTypeName')
        .populate('store', 'storeName location')
        .populate('saleOff', 'discount dateStart dateEnd')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    products: docs.map(doc => {
                        return {
                            _id: doc._id,
                            productType: doc.productType,
                            store: doc.store,
                            productName: doc.productName,
                            price: doc.price,
                            quantity: doc.quantity,
                            saleOff: doc.saleOff,
                            specifications: doc.specifications,
                            overviews: doc.overviews,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/products/' + doc._id
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
        });
});

router.get('/saleOff/:saleOffId', (req, res, next) => {
    Product.find({
            saleOff: req.params.saleOffId
        })
        .select('_id productType store productName price quantity saleOff specifications overviews')
        .populate('productType', 'productTypeName')
        .populate('store', 'storeName location')
        .populate('saleOff', 'discount dateStart dateEnd')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    products: docs.map(doc => {
                        return {
                            _id: doc._id,
                            productType: doc.productType,
                            store: doc.store,
                            productName: doc.productName,
                            price: doc.price,
                            quantity: doc.quantity,
                            saleOff: doc.saleOff,
                            specifications: doc.specifications,
                            overviews: doc.overviews,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/products/' + doc._id
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
        });
});

router.get('/page/:page', function (req, res, next) {
    var page = req.params.page || 1
    Product
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .select('_id productType store productName price quantity saleOff specifications overviews')
        .populate('productType', 'productTypeName')
        .populate('store', 'storeName location')
        .populate('saleOff', 'discount dateStart dateEnd')
        .exec()
        .then(products => {
            Product.countDocuments().exec(function (err, count) {
                res.status(200).json({
                    current: page,
                    pages: Math.ceil(count / perPage),
                    products: products
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

router.post('/filter', function (req, res, next) {
    var page = req.body.page || 1
    Product
        .find({
            productType: req.body.productTypeId
        })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .select('_id productType store productName price quantity saleOff specifications overviews')
        .populate('productType', 'productTypeName')
        .populate('store', 'storeName location')
        .populate('saleOff', 'discount dateStart dateEnd')
        .exec()
        .then(products => {
            Product.countDocuments({
                productType: req.body.productTypeId
            }).exec(function (err, count) {
                res.status(200).json({
                    current: page,
                    pages: Math.ceil(count / perPage),
                    products: products
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})


router.post('/findByName/page/:page', (req, res, next) => {
    var page = req.params.page || 1
    Product.find({
            productName: {
                '$regex': req.body.name,
                '$options': 'i'
            }
        })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .select('_id productType store productName price quantity saleOff specifications overviews')
        .populate('productType', 'productTypeName')
        .populate('store', 'storeName location')
        .populate('saleOff', 'discount dateStart dateEnd')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                Product.countDocuments({
                        productName: {
                            '$regex': req.body.name,
                            '$options': 'i'
                        }
                    })
                    .exec(function (err, count) {
                        res.status(200).json({
                            current: page,
                            pages: Math.ceil(count / perPage),
                            products: docs
                        })
                    })
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
        });
});

router.get('/store/:storeId/page/:page', (req, res, next) => {
    var page = req.params.page || 1
    Product.find({
            store: req.params.storeId
        })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .select('_id productType store productName price quantity saleOff specifications overviews')
        .populate('productType', 'productTypeName')
        .populate('store', 'storeName location')
        .populate('saleOff', 'discount dateStart dateEnd')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                Product.countDocuments({
                        store: req.params.storeId
                    })
                    .exec(function (err, count) {
                        res.status(200).json({
                            current: page,
                            pages: Math.ceil(count / perPage),
                            products: docs
                        })
                    })
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
        });
});

router.get('/productType/:productTypeId/page/:page', (req, res, next) => {
    var page = req.params.page || 1
    Product.find({
            productType: req.params.productTypeId
        })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .select('_id productType store productName price quantity saleOff specifications overviews')
        .populate('productType', 'productTypeName')
        .populate('store', 'storeName location')
        .populate('saleOff', 'discount dateStart dateEnd')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                Product.countDocuments({
                        productType: req.params.productTypeId
                    })
                    .exec(function (err, count) {
                        res.status(200).json({
                            current: page,
                            pages: Math.ceil(count / perPage),
                            products: docs
                        })
                    })
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
        });
});

router.post('/', (req, res, next) => {
    ProductType.findById(req.body.productTypeId)
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: 'Product type not found'
                })
            }
            Store.findById(req.body.storeId)
                .then((result) => {
                    if (!result) {
                        return res.status(404).json({
                            message: 'Store not found'
                        })
                    }
                    if (req.body.saleOffId != null) {
                        SaleOff.findById(req.body.saleOffId)
                            .then((result) => {
                                if (!result) {
                                    return res.status(404).json({
                                        message: 'Sale off not found'
                                    })
                                }
                                const product = new Product({
                                    _id: new mongoose.Types.ObjectId(),
                                    productType: req.body.productTypeId,
                                    store: req.body.storeId,
                                    productName: req.body.productName,
                                    price: req.body.price,
                                    quantity: req.body.quantity,
                                    saleOff: req.body.saleOffId,
                                    specifications: req.body.specifications,
                                    overviews: req.body.overviews
                                })
                                return product.save()
                            })
                    } else {
                        const product = new Product({
                            _id: new mongoose.Types.ObjectId(),
                            productType: req.body.productTypeId,
                            store: req.body.storeId,
                            productName: req.body.productName,
                            price: req.body.price,
                            quantity: req.body.quantity,
                            specifications: req.body.specifications,
                            overviews: req.body.overviews
                        })
                        return product.save()
                    }
                })
                .then(doc => {
                    console.log(doc);
                    res.status(201).json({
                        message: 'Product saved',
                        createdProduct: {
                            _id: doc._id,
                            productType: doc.productType,
                            store: doc.store,
                            productName: doc.productName,
                            price: doc.price,
                            quantity: doc.quantity,
                            saleOff: doc.saleOff,
                            specifications: doc.specifications,
                            overviews: doc.overviews,
                        },
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    });
                })
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            const updateOps = {};
            for (const ops of req.body) {
                updateOps[ops.propName] = ops.value;
            }
            Product.updateOne({
                    _id: id
                }, {
                    $set: updateOps
                })
                .exec()
                .then(result => {
                    res.status(200).json([{
                        message: 'Product updated',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + id
                        }
                    }]);
                }).catch((err) => {
                    res.status(500).json([{
                        message: 'Product update error',
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

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            Product.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Product deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/products',
                            body: {
                                productTypeId: 'ProductType ID',
                                storeId: 'Store ID',
                                productName: 'String',
                                price: 'Number',
                                quantity: 'Number',
                                saleOffId: 'SaleOff ID',
                                specifications: 'Array',
                                overviews: 'Array'
                            }
                        }
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Product delete error',
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