const express = require('express');
const authController = require('../controllers/auth');
const isAuth = require('../middlewares/isAuth');
const {body} = require('express-validator');
const User = require('../models/user');
const router = express.Router();

router.post('/signup', 
    [
        body('email', 'Please Enter Valid Email').isEmail().custom((value, {req}) => {
            return User.findOne({email: value}).then(userDoc => {
                if(userDoc){
                    return Promise.reject('E-mail Address Already Exist!');
                }
            })
        })
        .normalizeEmail(),
        body('password', 'Password must be Minimum 5 charecter Long').trim().isLength({min: 5}),
        body('name', 'Name is Required').trim().not().isEmpty(),
    ],
    authController.signup);

router.post('/signin', 
    [
        body('email', 'Please Enter Valid Email').isEmail().normalizeEmail(),
        body('password', 'Password must be Minimum 5 charecter Long').trim().isLength({min: 5}),
    ],
    authController.signin);

router.get('/profile', isAuth, authController.profile);

module.exports = router;