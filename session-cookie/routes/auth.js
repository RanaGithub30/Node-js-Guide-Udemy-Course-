const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login', authController.login);
router.post('/login/submit', authController.postLogin);
router.get('/logout', authController.logout);

module.exports = router;