const keyPublishable = 'pk_test_CeyyXLIDl0bfY9IiYwTIYZAU';
const keySecret = 'sk_test_VWec3gEiwOvZ7wQ6BCWYCHk2';

const express = require('express');
const router = express.Router();

const stripe = require('stripe')(keySecret);

router.post('/charge', (req, res, next) => {
    console.log(req.body.email + " | " + req.body.source + " | " + req.body.amount + " | " + req.body.order);
    stripe.customers.create({
            email: req.body.email,
            source: req.body.source
        })
        .then(customer => {
            stripe.charges.create({
                    amount: req.body.amount,
                    currency: 'usd',
                    customer: customer.id,
                    description: "Payment for order #" + req.body.order
                })
                .then(charge => {
                    console.log("Purchase Success:", charge);
                    return res.status(200).json(charge)
                })
                .catch(err => {
                    console.log("Purchase Error:", err);
                    return res.status(500).json(err);
                });
        }).catch(err => {
            console.log("Create Customer Error:", err);
            return res.status(500).json(err);
        });
});

router.post('/', (req, res, next) => {
    console.log(req.body.email + " | " + req.body.source + " | " + req.body.amount + " | " + req.body.order);
    stripe.customers.create({
        email: req.body.email
    }).then((customer) => {
        console.log("CustomerID: "+customer.id);
        return stripe.customers.createSource(customer.id, {
            source: req.body.source
        });
    }).then((source) => {
        console.log("SourceID: "+source.id);
        return stripe.charges.create({
            amount: req.body.amount,
            currency: 'usd',
            customer: source.customer,
            description: "Payment for order #" + req.body.order
        });
    }).then((charge) => {
        console.log("ChargeID: "+charge.id);
        res.status(200).json({
            message: "Payment success",
            charge: charge
        });
    }).catch((err) => {
        console.log("Error: "+err);
        res.status(500).json({
            message: "Payment failed",
            error: err
        })
    });
});

module.exports = router;