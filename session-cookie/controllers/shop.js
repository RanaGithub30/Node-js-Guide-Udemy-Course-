const Product = require('../models/product');
const User = require('../models/user');

exports.getProducts = (req, res, next) => {
  Product.find().then(products => {
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
  Product.find().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => console.log(err));
};


exports.getCart = (req, res, next) => {
  User.find()
    .populate('cart.items.productId') // Populate product details for each user's cart
    .then(users => {
      // Collect all users' cart items into an array
      const allCartItems = users.map(user => {
        return {
          userId: user._id,
          name: user.name,
          cartItems: user.cart.items // This will include populated product details
        };
      });

      res.render('shop/cart', {
        users: allCartItems, // Pass all users' cart items to the view
        pageTitle: 'All Users Cart',
        path: '/cart'
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(product => {
      User.find().then(users => {
        if (users.length > 0) {
          const randUserIndex = Math.floor(Math.random() * users.length);
          const randomUser = users[randUserIndex]; // Get random user document
          
          // Call addToCart on the user instance
          randomUser.addToCart(product)
            .then(() => {
              res.redirect('/cart');
            })
            .catch(err => console.log(err));
        }
      }).catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

// exports.postCartDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findById(prodId, product => {
//     Cart.deleteProduct(prodId, product.price);
//     res.redirect('/cart');
//   });
// };