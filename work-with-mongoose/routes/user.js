const path = require('path');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/list', userController.userList);
router.get('/add', userController.userAdd);
router.post('/save', userController.userSave);

module.exports = router;