const path = require('path');
const express = require('express');
const cartController = require('../controllers/cart');
const router = express.Router();

router.post('/add-to-cart', cartController.addToCart);
router.get('/cart', cartController.getCart);
router.post('/cart-delete-item', cartController.postCartDeleteProduct);

module.exports = router;