const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = require('../helpers/path');

/**
 * Define route 
*/

router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir, '../', 'views', 'shop.html')); // sendFile is used to render HTML in server
});

router.use('/contact-us', (req, res, next) => {
    res.send("<form action='/contact-us-submit' method='POST'><input type='text' name='name' placeholder='Enter Your Name'><button type='submit'>Submit</button></form>");
});

router.use('/contact-us-submit', (req, res, next) => {
    console.log(req.body);
    res.redirect('/home');
});

router.use('/settings', (req, res, next) => {
    res.send("This is Settings Page");
});

module.exports = router;