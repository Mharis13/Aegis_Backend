const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController.js');

// Registration route
router.post('/register', registerController.registerUser);

module.exports = router;
