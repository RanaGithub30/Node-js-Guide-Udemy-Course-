const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = require('../helpers/path');
const shopController = require('../controllers/shopController');

/**
 * Define route 
*/

router.get('/', shopController.index);

module.exports = router;