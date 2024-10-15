const adminRoutes = require('../routes/admin');
const adminCont = require('./adminController');

module.exports.index = (req, res, next) => {
    const products = adminCont.prods;
    console.log(products);
    res.render('shop', {prod: products, docTitle: 'Shop', path: "/shop", pageTitle: 'Shop'});
}