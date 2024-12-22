const Product = require('../../models/product');
const Order = require('../../models/order');
const stripe = require('stripe')('sk_test_51QYKjjFQCs350RMoJ5mNJ5ki7kuCgajvYCT5kDPdTEsl5fzup5nkgmgWBCk3bv9tMSxpQWyw8L163JYp4avJ8FoF00WgVvxdJ4');
const YOUR_DOMAIN = 'http://localhost:3000';

exports.createStripePayment = async (req, res, next) => {
    const totalPrice = req.body.totalPrice;
    const totalQuantity = req.body.totalQuantity;
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Checkout', // Replace with actual product name
                description: 'No Description', // Replace with actual product description
              },
              unit_amount: totalPrice, // Price in smallest currency unit (e.g., cents for USD)
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/api/payments/stripe-success`,
        cancel_url: `${YOUR_DOMAIN}/api/payments/stripe-fail`,
    });
    
    res.redirect(303, session.url);
};

exports.stripeSuccess = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
        res.render('gateway/stripe/success', {
            path: '/Stripe',
            pageTitle: 'Success',
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.stripeFail = (req, res, next) => {
    res.render('gateway/stripe/fail', {
        path: '/Stripe',
        pageTitle: 'Fail',
    });
}