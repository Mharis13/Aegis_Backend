const User = require('../../models/UserModel');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('name') // Exclude password field
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('name email role'); // Exclude password field

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Update user role
exports.updateUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role specified' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select('name email role'); // Exclude password field

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User role updated successfully', user });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        else {
            await User.deleteOne(userId);
            res.status(200).json({ success: true, message: 'User deleted successfully' });
        }
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

//Update user expects password

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true }
        ).select('name email role'); // Exclude password field

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User updated successfully', user });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
module.exports = exports;