const products = [];

module.exports.productAdd = (req, res, next) => {
    res.render('add-product', {path: '/product-add', pageTitle: 'Product Add'});
}

module.exports.prodSubmit = (req, res, next) => {
    products.push({ title: req.body.title});
    res.redirect('/');
}

module.exports.prods = products;