const express = require('express');
const authController = require('../controllers/auth');
const {check, body} = require('express-validator');
const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post('/login', 
    [
        check('email', 'Enter a Valid Email').isEmail(),
        body('password', 'Please Enter a Password with Atleast 4 Charecter Long').isLength({min: 4})
    ],
    authController.postLogin);
router.post('/signup', 
    [
        check('email').isEmail().withMessage('Please Enter a Valid Email'),
        body('password', 'Please Enter a Password with Atleast 4 Charecter Long').isLength({min: 4, max: 20}),
        body('confirmPassword').custom((value, {req}) => {
              if(value !== req.body.password){
                    throw new Error('Password & Confirn Password Must Same');
              }
              return true;
        })
    ], 
    authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/reset/password', authController.resetPassword);
router.post('/post/reset/password', authController.postResetPassword);
router.get('/reset/password/:token', authController.newPassword);
router.post('/reset/password/action', authController.updateNewPassword);

module.exports = router;