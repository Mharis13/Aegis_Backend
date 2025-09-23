const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if a user already exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Create a new user
        user = new User({ email, password, name , });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to a database
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = exports;