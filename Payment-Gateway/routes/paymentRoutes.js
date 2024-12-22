const express = require('express');
const stripeController = require('../controllers/PaymentGateways/stripe');
const router = express.Router();

router.post('/create-stripe-payment', stripeController.createStripePayment);
router.get('/stripe-success', stripeController.stripeSuccess);
router.get('/stripe-fail', stripeController.stripeFail);

module.exports = router;