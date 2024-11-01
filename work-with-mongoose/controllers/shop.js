const Product = require('../models/product');
const User = require('../models/user');

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then(product => {
    console.log(product);
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  }).catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => console.log(err));
};


exports.getCart = (req, res, next) => {
  const user = new User(req.userId, req.userCart); // Pass userId and cart as needed
  User.getCart()
    .then(cartProducts => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId).then(product => {
    User.fetchAll().then(users => {
      if(users.length >0 ){
          const randUserIndex = Math.floor(Math.random() * users.length);
          const randomId = users[randUserIndex]._id; // get random user id
          
          User.addToCart(product, prodId, randomId)
          .then(() => {res.redirect('/cart');})
          .catch(err => console.log(err));
      }
    }).catch(err => console.log(err));
 }).catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};