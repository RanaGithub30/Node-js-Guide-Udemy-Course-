const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = require('../helpers/path');

const products = [];

router.get('/product-add', (req, res, next) => {
     res.render('add-product', {path: '/product-add', pageTitle: 'Product Add'});
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/product-submit', (req, res, next) => {
    products.push({ title: req.body.title});
    res.redirect('/');
});

module.exports.routes = router;
module.exports.products = products;

// module.exports = router;