const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const connectDB = require('./config/databaseConfig');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Export the app for testing or other modules
module.exports = app;

// Only start the server if this file is run directly (not when imported)
if (require.main === module) {
    (async () => {
        try {
            await connectDB();
            app.listen(port, () => {
                console.log(`Server is running on http://localhost:${port}`);
            });
        } catch (error) {
            console.error('Failed to start server due to DB connection error:', error);
            process.exit(1);
        }
    })();
}
