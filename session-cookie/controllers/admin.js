const Product = require('../models/product');
const User = require('../models/user');

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
  
  // get random userid from user table
  const allUser = User.find().then(users => {
        const userLength = users.length;
        const randomUser = Math.floor(Math.random() * userLength);
        const randomUserId = users[randomUser]._id;
        
        const product = new Product(
          {
            title: title,
            price: price, 
            description: description, 
            imageUrl: imageUrl,
            userId: randomUserId
          }
        );

        product.save() // save function provided by mongoose
        .then(result => {
          res.redirect('/');
        }).catch(err => console.log(err));

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

    Product.findById(prodId).then(result => {
      res.render('admin/edit-product', {
        // users: users,
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const userId = req.body.user;
  
  Product.findById(prodId).then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDesc;
    return product.save();
  }).then(result => {
    res.redirect('/admin/products');
  }).catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
  .select('title price imageUrl') // fetch selected fields from products table
  .populate('userId', 'name') /** The populate function in Mongoose is used to replace the specified field (in this case, userId) with documents from a related collection.  */
  .then(products => {
    console.log(products);
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndDelete(prodId)
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};