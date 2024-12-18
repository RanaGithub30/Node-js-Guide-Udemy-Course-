const fs = require('fs');
const path = require('path');
const Product = require('../models/product');
const Order = require('../models/order');
const pdfkit = require('pdfkit'); // to generate dynamic pdf

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken()
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken()
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

/**
 * Get Invoice (Download Invoice)
*/

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    // check the order for perticular user
    Order.findById(orderId).then(order => {
        if(!order){
            return next(new Error('No Order Found'));
        }

        if(order.user.userId.toString() !== req.user._id.toString()){
            return next(new Error('Unauthorized'));
        }

        // if the order belongs to logedin user then he can access & download the invoice
        const invoiceName = 'invoice.pdf';
        const invoicePath = path.join('data', 'invoices', invoiceName);

        const pdfDoc = new pdfkit();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${invoiceName}"`);
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        pdfDoc.fontSize(26).text('Invoice', {
          underline: true,
        })
        pdfDoc.text('-----------------------------');
        let totalPrice = 0;
        order.products.forEach(prod => {
          totalPrice += prod.quantity * prod.product.price;
          pdfDoc.fontSize(14).text(prod.product.title + '-' + prod.quantity + 'X' + '$' + prod.product.price);
        })
        pdfDoc.text('-----------------------------');
        pdfDoc.fontSize(20).text('Total Price - '+ '$'+ totalPrice);
        pdfDoc.end();

        /** This is file preloading & download code, it can be suitable for small file but for large file it is good to use 
         * file striming using chunk for fast & efficient way */

        // fs.readFile(invoicePath, (err, data) => {
        //   if(err){
        //       return next(err);
        //   }
        //   res.setHeader('Content-Type', 'application/pdf');
        //   res.setHeader('Content-Disposition', `attachment; filename="${invoiceName}"`);
        //   res.send(data);
        // });

        /** Code using File Streaming */
        // const file = fs.createReadStream(invoicePath);
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', `attachment; filename="${invoiceName}"`);
        // file.pipe(res);

    }).catch(err => next(err));
    
}