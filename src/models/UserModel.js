const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [6, 'Password must be at least 6 characters long'],
            maxLength: [64, 'Password cannot be more than 64 characters long'],
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minLength: [2, 'Name must be at least 2 characters long'],
            maxLength: [50, 'Name cannot be more than 50 characters long'],
        },
        loginAttempts: {
            type: Number,
            default: 0,
            required: true,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        blockedUntil: {
            type: Date,
            default: null,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true,
        collection: 'users',
    }
);

module.exports = mongoose.model('User', UserSchema);

