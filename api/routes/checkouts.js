const keyPublishable = 'pk_test_CeyyXLIDl0bfY9IiYwTIYZAU';
const keySecret = 'sk_test_VWec3gEiwOvZ7wQ6BCWYCHk2';

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(keySecret);

stripe.setTimeout(20000);

router.post("/charge", (req, res, next) => {
    console.log(req.body);
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
                    res.status(200).json(charge)
                })
                .catch(err => {
                    console.log("Purchase Error:", err);
                    res.status(500).json(err);
                });
        })
        .catch(err => {
            console.log("Create Customer Error:", err);
            res.status(500).json(err);
        });
});

module.exports = router;

// stripe.customers.retrieve({
//     email: req.body.email
// })
// .then((customer) => {
//     stripe.customers.createSource(customer.id, {
//             source: req.body.source
//         })
//         .then((source) => {
//             stripe.charges.create({
//                     amount: req.body.amount,
//                     currency: "usd",
//                     source: source,
//                     description: "Payment for order #" + req.body.order,
//                 })
//                 .then(charge => {
//                     console.log("Charge detail:", charge);
//                     res.send(charge);
//                 })
//                 .catch(err => {
//                     console.log("Purchase Error:", err);
//                     res.status(500).send({
//                         error: "Purchase Failed"
//                     });
//                 });
//         })
//         .catch(err => {
//             console.log("Create Source Error:", err);
//             res.status(500).send({
//                 error: "Create Source Failed"
//             });
//         });
// }).catch((err) => {
//     stripe.customers.create({
//             email: req.body.email,
//             source: req.body.source
//         })
//         .then(customer => {
//             stripe.charges.create({
//                     amount: req.body.amount,
//                     currency: "usd",
//                     customer: customer.id,
//                     description: "Payment for order #" + req.body.order,
//                 })
//                 .then(charge => {
//                     console.log("Charge detail:", charge);
//                     res.send(charge);
//                 })
//                 .catch(err => {
//                     console.log("Purchase Error:", err);
//                     res.status(500).send({
//                         error: "Purchase Failed"
//                     });
//                 });
//         })
//         .catch(err => {
//             console.log("Create Customer Error:", err);
//             res.status(500).send({
//                 error: "Create Customer Failed"
//             });
//         });
// });