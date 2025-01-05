const express = require('express');
const feedController = require('../controllers/feed');
const {body} = require('express-validator');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.get('/post', isAuth, feedController.getPost);
router.post('/create/post', 
    [
        body('title', 'Title must be Minimum 5 charecter Long').trim().isLength({min: 5}),
        body('content', 'Content must be Minimum 5 charecter Long').trim().isLength({min: 5}),
        body('creator', 'Creator must be Minimum 2 charecter Long').trim().isLength({min: 2}),
    ], 
    isAuth, feedController.createPost);
router.get('/post/details/:postId', isAuth, feedController.postDetails);
router.post('/post/update/:postId', 
    [
        body('title', 'Title must be Minimum 5 charecter Long').trim().isLength({min: 5}),
        body('content', 'Content must be Minimum 5 charecter Long').trim().isLength({min: 5}),
        body('creator', 'Creator must be Minimum 2 charecter Long').trim().isLength({min: 2}),
    ],
    isAuth, feedController.postUpdate);
router.get('/post/delete/:postId', isAuth, feedController.postDelete);

module.exports = router;