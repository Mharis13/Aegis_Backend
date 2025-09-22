const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const express = require('express');
const main = express();
const port = 3000;

const connectDB = require('./config/databaseConfig');

// Connect to database
(async () => {
    try {
        await connectDB();

        main.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server due to DB connection error:', error);
    }
})();
