const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');
const {check, body} = require('express-validator');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/products', isAuth, adminController.getProducts);
router.post('/add-product', isAuth,
    [
        check('title', 'Title is Required').notEmpty(),
        check('price', 'Price must be a positive number').isFloat({gt: 0})
    ], 
    adminController.postAddProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth,
    [
        check('title', 'Title is Required').notEmpty(),
        body('price', 'Price must be a positive number').isFloat({gt: 0})
    ],
    adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;