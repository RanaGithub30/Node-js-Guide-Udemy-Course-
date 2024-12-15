const fs = require('fs');
const path = require('path');
const Product = require('../models/product');
const Order = require('../models/order');
const pdfkit = require('pdfkit'); // to generate dynamic pdf
const ITEMS_PER_PAGES = 4;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1; // + convert the string to int
  let totalItems;

  Product.find({userId: req.user._id})
  .countDocuments()
  .then(numProducts => {
    totalItems = numProducts;
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGES)
    .limit(ITEMS_PER_PAGES);
  })
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
      isAuthenticated: req.session.isLoggedIn,
      csrfToken: req.csrfToken(),
      currentPage: page,
      totalProducts: totalItems,
      hasNextPage: ITEMS_PER_PAGES * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGES)
    });
  })
  .catch(err => {
    console.log(err)
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
  const page = +req.query.page || 1; // + convert the string to int
  let totalItems;

  Product.find()
  .countDocuments()
  .then(numProducts => {
    totalItems = numProducts;
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGES)
    .limit(ITEMS_PER_PAGES);
  })
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      isAuthenticated: req.session.isLoggedIn,
      csrfToken: req.csrfToken(),
      currentPage: page,
      totalProducts: totalItems,
      hasNextPage: ITEMS_PER_PAGES * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGES)
    });
  })
  .catch(err => {
    console.log(err)
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
    }).catch(err => next(err));
}