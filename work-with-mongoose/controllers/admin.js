const Product = require('../models/product');
const User = require('../models/user');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
      users: [],
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.body.user;
  const product = new Product(
    {
      title: title,
      price: price, 
      description: description, 
      imageUrl: imageUrl
    }
  );
  product.save() // save function provided by mongoose
  .then(result => {
    res.redirect('/');
  }).catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId).then(product => {
    if (!product) {
      return res.redirect('/');
    }

    User.fetchAll().then(users => {
    res.render('admin/edit-product', {
      users: users,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
    })
  }).catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const userId = req.body.user;
  const updatedProduct = new Product(
    updatedTitle,
    updatedPrice,
    updatedDesc,
    updatedImageUrl,
    prodId,
    userId
  );

  updatedProduct.save().then(result => {
    console.log(result);
    res.redirect('/admin/products');
  }).catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};