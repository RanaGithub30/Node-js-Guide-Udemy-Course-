const express = require('express');
const router = express.Router();
const rootDir = require('../helpers/path');
const path = require('path');

router.get('/', (req, res, next) => {
      res.sendFile(path.join(rootDir, 'views', 'index.html'));
});

router.get('/users', (req, res, next) => {
      res.sendFile(path.join(rootDir, 'views', 'user.html'));
});

module.exports = router;