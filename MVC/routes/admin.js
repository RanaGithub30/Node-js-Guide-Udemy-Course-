const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = require('../helpers/path');
const adminController = require('../controllers/adminController');

// Use Controller Here
router.get('/product-add', adminController.productAdd);
router.post('/product-submit', adminController.prodSubmit);

module.exports.routes = router;

// module.exports = router;