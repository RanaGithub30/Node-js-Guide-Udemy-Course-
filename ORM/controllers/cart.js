const Cart = require('../models/cart');
const Product = require('../models/product');

exports.addToCart = (req, res, next) => {
    const prodId = req.body.productId;
    Cart.addToCart(prodId).then(([rows]) => {
        res.redirect('/cart');  
    }).catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
    Cart.getCart()
      .then(([cartItems]) => {
        const cartProductIds = cartItems.map(item => item.prod_id); // Get product IDs from cart
  
        // Fetch all products and filter the ones that are in the cart
        Product.fetchAll()
          .then(([allProducts]) => {
            const cartProducts = [];
  
            for (let product of allProducts) {
              const cartProductData = cartItems.find(cartItem => cartItem.prod_id === product.id);
              if (cartProductData) {
                cartProducts.push({
                  productData: product, 
                  qty: cartProductData.qty || 1 // Add quantity (or default to 1 if qty is not stored)
                });
              }
            }
  
            // Render the cart view with the cart products
            res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              products: cartProducts
            });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };
  
  exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Cart.cartDelete(prodId).then(([records]) => {
        res.redirect('/cart');
    }).catch(err => console.log(err));
  };