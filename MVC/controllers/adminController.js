const prodModel = require('../models/products');
const products = [];

module.exports.productAdd = (req, res, next) => {
    res.render('add-product', {path: '/product-add', pageTitle: 'Product Add'});
}

module.exports.prodSubmit = (req, res, next) => {
    const prod = new prodModel(req.body.title);
    prod.save();
    res.redirect('/');
}

module.exports.prods = products;