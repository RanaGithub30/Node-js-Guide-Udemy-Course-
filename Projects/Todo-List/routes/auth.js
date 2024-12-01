const express = require('express');
const authController = require('../controllers/auth');
const {check, body} = require('express-validator');
const { isAuthenticated, attachUser } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post('/post/signup', [
    body('name').isString().isLength({ min: 1 }).withMessage('Name cannot be empty').trim().withMessage('Please Enter Your Name'),
    check('email').isEmail().withMessage('Please Enter a Valid Email').normalizeEmail(),
    body('psw', 'Please Enter a Password with Atleast 4 Charecter Long').isLength({min: 4}).trim(),
    body('psw_repeat').trim().custom((value, {req}) => {
          if(value !== req.body.psw){
                throw new Error('Password & Confirn Password Must Same');
          }
          return true;
    })
], authController.postSignup);
router.post('/post/login', [
    check('email', 'Enter a Valid Email').isEmail().normalizeEmail(),
    body('psw', 'Please Enter a Password with Atleast 4 Charecter Long').isLength({min: 4}).trim()
], authController.postLogin);

/** Use Auth Middleware */
router.get('/dashboard', isAuthenticated, authController.dashboard);
router.get('/logout', isAuthenticated, authController.logout);

module.exports = router;