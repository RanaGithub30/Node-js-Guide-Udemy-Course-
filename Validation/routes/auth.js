const express = require('express');
const authController = require('../controllers/auth');
const {check} = require('express-validator');
const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post('/login', authController.postLogin);
router.post('/signup', check('email').isEmail(), authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/reset/password', authController.resetPassword);
router.post('/post/reset/password', authController.postResetPassword);
router.get('/reset/password/:token', authController.newPassword);
router.post('/reset/password/action', authController.updateNewPassword);

module.exports = router;