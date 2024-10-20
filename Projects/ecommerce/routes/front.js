const express = require('express');
const router = express.Router();
const frontController = require('../controllers/frontController');

router.get('/', frontController.index);

module.exports = router;