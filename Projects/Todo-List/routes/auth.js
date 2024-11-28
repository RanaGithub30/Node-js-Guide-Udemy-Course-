const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post('/post/signup', authController.postSignup);

module.exports = router;