const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/auth/register', authController.registerAdmin);
router.post('/auth/login', authController.loginAdmin);

module.exports = router;
