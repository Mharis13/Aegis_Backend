const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKED_TIME = 10 * 60 * 1000; // 10 minutes

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Input validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email and password are required' 
            });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Check if the user is blocked
        if (user.isBlocked && user.blockedUntil > new Date()) {
            const timeRemaining = Math.ceil((user.blockedUntil - new Date()) / 60000);
            return res.status(423).json({ 
                success: false,
                message: `Account is temporarily locked. Try again in ${timeRemaining} minutes` 
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Increment login attempts
            user.loginAttempts = (user.loginAttempts || 0) + 1;
            
            // Check if the account should be blocked
            if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                user.isBlocked = true;
                user.blockedUntil = new Date(Date.now() + LOCKED_TIME);
                await user.save();
                
                return res.status(423).json({ 
                    success: false,
                    message: 'Too many failed attempts. Account locked for 10 minutes.' 
                });
            }
            
            await user.save();
            return res.status(401).json({ 
                success: false,
                message: `Invalid credentials. ${MAX_LOGIN_ATTEMPTS - user.loginAttempts} attempts remaining.` 
            });
        }

        // Reset login attempts on successful login
        user.loginAttempts = 0;
        user.isBlocked = false;
        user.blockedUntil = null;
        await user.save();

        // Generate JWT token
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error('JWT Error:', err);
                    return res.status(500).json({ 
                        success: false,
                        message: 'Error generating token' 
                    });
                }
                
                res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    token: token,
                    user: {
                        id: user._id,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during authentication' 
        });
    }
};