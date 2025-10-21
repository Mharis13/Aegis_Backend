const User = require('../../models/UserModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const crypto = require('crypto');

exports.sendResetLink = async (req, res) => {
    try {
        const {email} = req.body;
        let user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({message: 'User does not exist'});
        }

        // Generate token and expiration
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Build the reset URL (replace with your domain)
        const resetUrl = `http://localhost:3001/reset-password/${resetToken}`;

        // Configure the email transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail', auth: {
                user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: ${resetUrl}`
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({message: 'Reset link sent to email'});
    } catch (error) {
        console.error('Error sending reset link:', error);
        res.status(500).json({message: 'Server error'});
    }
};
exports.resetPassword = async (req, res) => {
    try {
        const {email, oldPassword, newPassword} = req.body;

        let user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({message: 'User does not exist'});
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({message: 'Old password is incorrect'});
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        // Configure the email transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail', auth: {
                user: process.env.EMAIL_USER, // Use environment variables
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password changed',
            text: 'Your password has been changed successfully.'
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(201).json({message: 'Password changed successfully and email sent'});
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({message: 'Server error'});
    }
}

module.exports = exports;