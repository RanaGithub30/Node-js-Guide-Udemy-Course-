const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mail');

router.get('/mail/send', mailController.sendMail);
router.post('/mail/send/process', mailController.sendMailProcess);

module.exports = router;