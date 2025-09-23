const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const connectDB = require('./config/databaseConfig');
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

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
