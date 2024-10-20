const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/login', adminController.index);
router.get('/dashboard', adminController.dashboard);
router.get('/profile', adminController.profile);
router.get('/contact', adminController.contact);
router.get('/user-list', adminController.usersLists);

module.exports = router;