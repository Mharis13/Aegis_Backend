const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController.js');
const loginController = require('../controllers/loginController.js');

// Registration route
router.post('/register', registerController.registerUser);
// Login route
router.post('/login', loginController.loginUser);

module.exports = router;
