const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = require('../helpers/path');

router.get('/product', (req, res, next) => {
    res.send("This is Product");
});

router.get('/product-add', (req, res, next) => {
    res.sendFile(path.join(rootDir, '../', 'views', 'add-product.html'));
    // res.send("<form action='/product-submit' method='POST'><input type='text' name='name' placeholder='Enter Product Name'><button type='submit'>Submit</button></form>");
});

router.post('/product-submit', (req, res, next) => {
    console.log(req.body);
    res.redirect('/product');
});

module.exports = router;