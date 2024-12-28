const express = require('express');
const feedController = require('../controllers/feed');

const router = express.Router();

router.get('/feed/post', feedController.getPost);

module.exports = router;