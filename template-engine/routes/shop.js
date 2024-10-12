const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = require('../helpers/path');
const adminRoutes = require('../routes/admin');

/**
 * Define route 
*/

router.get('/', (req, res, next) => {
    const products = adminRoutes.products;
    res.render('shop', {prod: products, docTitle: 'Shop'}); // to render template engine in server
    // res.sendFile(path.join(rootDir, 'views', 'shop.html')); // sendFile is used to render HTML in server
});

module.exports = router;