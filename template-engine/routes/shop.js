const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = require('../helpers/path');

/**
 * Define route 
*/

router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'shop.html')); // sendFile is used to render HTML in server
});

module.exports = router;