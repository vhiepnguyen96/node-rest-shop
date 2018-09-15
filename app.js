const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoClient = require('mongoose')

const accountRoutes = require('./api/routes/accounts');
const categoryRoutes = require('./api/routes/categories');
const customerRoutes = require('./api/routes/customers');
const deliveryAddressRoutes = require('./api/routes/deliveryAddresses');
const deliveryPriceRoutes = require('./api/routes/deliveryPrices');
const followRoutes = require('./api/routes/followStores');
const orderItemRoutes = require('./api/routes/orderItems');
const orderRoutes = require('./api/routes/orders');
const orderStateRoutes = require('./api/routes/orderStates');
const paymentMethodRoutes = require('./api/routes/paymentMethods');
const productImageRoutes = require('./api/routes/productImages');
const productRoutes = require('./api/routes/products');
const productTypeRoutes = require('./api/routes/productTypes');
const ratingRoutes = require('./api/routes/ratings');
const registeredSaleRoutes = require('./api/routes/registeredSales');
const reviewRoutes = require('./api/routes/reviews');
const roleRoutes = require('./api/routes/roles');
const saleOffRoutes = require('./api/routes/salesOff');
const specificationTypeRoutes = require('./api/routes/specificationTypes');
const storeRoutes = require('./api/routes/stores');
const wishListRoutes = require('./api/routes/wishList');

const testRoutes = require('./api/routes/templates');

mongoose.connect(
    "mongodb+srv://node-shop:" + process.env.MONGO_ATLAS_PW + "@node-rest-shop-hj5xt.mongodb.net/test?retryWrites=true", {
        useNewUrlParser: true
    }
)

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

app.use('/accounts', accountRoutes);
app.use('/categories', categoryRoutes);
app.use('/customers', customerRoutes);
app.use('/deliveryAddresses', deliveryAddressRoutes);
app.use('/deliveryPrices', deliveryPriceRoutes);
app.use('/followStores', followRoutes);
app.use('/orderItems', orderItemRoutes);
app.use('/orders', orderRoutes);
app.use('/orderStates', orderStateRoutes);
app.use('/paymentMethods', paymentMethodRoutes);
app.use('/productImages', productImageRoutes);
app.use('/products', productRoutes);
app.use('/productTypes', productTypeRoutes);
app.use('/ratings', ratingRoutes);
app.use('/registeredSales', registeredSaleRoutes);
app.use('/reviews', reviewRoutes);
app.use('/roles', roleRoutes);
app.use('/salesOff', saleOffRoutes);
app.use('/specificationTypes', specificationTypeRoutes);
app.use('/stores', storeRoutes);
app.use('/wishList', wishListRoutes);

app.use('/test', testRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

module.exports = app;