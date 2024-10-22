const Cart = require('../models/cart');
const Product = require('../models/product');

exports.addToCart = (req, res, next) => {
    const prodId = req.body.productId;
    Cart.create({
       prod_id: prodId,
    }).then(result => {
      console.log('Added to Cart Successfully');
      res.redirect('/cart');  
    }).catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
  req.user.getCart()  // Fetch the cart for the user
    .then(cart => {
      if (!cart) {
        // If no cart exists, create a new one for the user
        return req.user.createCart();
      }
      return cart;  // If cart exists, return it
    })
    .then(cart => {
      return cart.getProducts();  // Fetch all products associated with the cart
    })
    .then(products => {
      console.log(products)
      // Render the cart view with the products
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products  // Pass the products to the view
      });
    })
    .catch(err => console.log(err));
};

/** Old code */
exports.getCartOld = (req, res, next) => {
      Cart.findAll()
      .then(cartItems => {
        // Create an array of promises to fetch products for each cart item
        const productPromises = cartItems.map(cart => {
          return Product.findByPk(cart.prod_id).then(product => {
            return {
              productData: product,  // Attach product data
              qty: cart.qty || 1          // Attach quantity from the cart
            };
          });
        });

        // Wait for all product fetch promises to resolve
        return Promise.all(productPromises);
      })
      .then(cartProducts => {
        // Render the cart view with the fetched products and their quantities
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: cartProducts
        });
      })
      .catch(err => console.log(err));
 };
  
  exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Cart.destroy({ where: { prod_id: prodId } })
      .then(result => {
        res.redirect('/cart');
      })
      .catch(err => console.log(err));
  };