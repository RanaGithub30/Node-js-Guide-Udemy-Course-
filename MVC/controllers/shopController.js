const prodModel = require('../models/products');

module.exports.index = (req, res, next) => {
    const products = prodModel.fetchAll();
    res.render('shop', {prod: products, docTitle: 'Shop', path: "/shop", pageTitle: 'Shop'});
}