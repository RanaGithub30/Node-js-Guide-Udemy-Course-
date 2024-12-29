const express = require('express');
const feedController = require('../controllers/feed');
const {body} = require('express-validator');

const router = express.Router();

router.get('/post', feedController.getPost);
router.post('/create/post', 
    [
        body('title', 'Title must be Minimum 5 charecter Long').trim().isLength({min: 5}),
        body('content', 'Content must be Minimum 5 charecter Long').trim().isLength({min: 5}),
        body('creator', 'Creator must be Minimum 2 charecter Long').trim().isLength({min: 2}),
    ], 
    feedController.createPost);
router.get('/post/details/:postId', feedController.postDetails);
router.post('/post/update/:postId', 
    [
        body('title', 'Title must be Minimum 5 charecter Long').trim().isLength({min: 5}),
        body('content', 'Content must be Minimum 5 charecter Long').trim().isLength({min: 5}),
        body('creator', 'Creator must be Minimum 2 charecter Long').trim().isLength({min: 2}),
    ],
    feedController.postUpdate);
router.get('/post/delete/:postId', feedController.postDelete);

module.exports = router;