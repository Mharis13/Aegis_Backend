const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController');

// Get user profile
router.get('/:id', userController.getUserById);

// Get all users
router.get('/', userController.getAllUsers);

// Update user role
router.put('/:id/role', userController.updateUserRole);

// Delete user
router.delete('/:id', userController.deleteUser);

//Update user profile
router.post('/:id', userController.updateUser);
module.exports = router;


