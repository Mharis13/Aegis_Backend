const express = require('express');
const router = express.Router();
const registerController = require('../controllers/auth/registerController.js');
const loginController = require('../controllers/auth/loginController.js');
const resetPasswordController = require('../controllers/auth/resetPasswordController.js');

// Registration route
router.post('/register', registerController.registerUser);
// Login route
router.post('/login', loginController.loginUser);
// Logout route

// Change password route
router.post('/reset-password', resetPasswordController.resetPassword);
//Send reset link route
router.post('/send-reset-link', resetPasswordController.sendResetLink);


module.exports = router;
