const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post('/login', authController.postLogin);
router.post('/signup', authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/reset/password', authController.resetPassword);
router.post('/post/reset/password', authController.postResetPassword);
router.get('/reset/password/:token', authController.newPassword);
router.post('/reset/password/action', authController.updateNewPassword);

module.exports = router;