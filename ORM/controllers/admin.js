const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
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
  req.user.createProduct({
    title: title,
    price: price,
    description: description,
    image: imageUrl,
   }).then(() => {
    return res.redirect('/');
  }).catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  
  /**
   * We can also use findAll method with where condition insteadof using findByPk
  */
 req.user.getProducts({where: {id: prodId}}).then(products => {
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
    product: products[0]
  });
}).catch(err => console.log(err));

 // Another way - 1
  // Product.findAll({where: {id: prodId}}).then(products => {
  //   res.render('admin/edit-product', {
  //     pageTitle: 'Edit Product',
  //     path: '/admin/edit-product',
  //     editing: editMode,
  //     product: products[0]
  //   });
  // }).catch(err => console.log(err));

  // Way - 2

  // Product.findByPk(prodId).then(product => {
  //   res.render('admin/edit-product', {
  //     pageTitle: 'Edit Product',
  //     path: '/admin/edit-product',
  //     editing: editMode,
  //     product: product
  //   });
  // }).catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId).then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.image = updatedImageUrl;
      product.description = updatedDesc;
      return product.save();
  }).then(result => {
    res.redirect('/admin/products');
  }) // This then block is for when the product save successfully
  .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => console.log(err));

  // Product.findAll().then(products => {
  //   res.render('admin/products', {
  //     prods: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products'
  //   });
  // }).catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId).then(product => {
      return product.destroy();
  }).then(result => {
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};