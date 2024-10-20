const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // use findByPk => find by primary key for sequilize
  Product.findByPk(prodId).then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  }).catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch((err) => console.log(err));
};