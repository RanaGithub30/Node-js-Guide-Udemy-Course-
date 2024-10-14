const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/users', (req, res, next) => {
    res.render('users');
});

module.exports.routes = router;