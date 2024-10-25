const express = require('express');
const router = express.Router();
const frontController = require('../controllers/frontController');

router.get('/', frontController.index);
router.get('/shop', frontController.shop);
router.get('/why-us', frontController.whyUs);
router.get('/testimonial', frontController.testimonial);
router.get('/contact-us', frontController.contact);

module.exports = router;