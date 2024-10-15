const express = require('express');
const router = express.Router();
const userName = [];

router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/users', (req, res, next) => {
    res.render('users', {userNames: userName});
});

router.post('/user-submit', (req, res, next) => {
    userName.push({ name: req.body.name });
    res.redirect('/users');
});

module.exports.routes = router;