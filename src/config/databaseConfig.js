const mongoose = require('mongoose');
const DB_CONNECTION_STRING = process.env.DB_URL;

/**
 * Connects to the MongoDB database using the provided connection string.
 * If the connection string is not provided, an error is thrown.
 * @throws {Error} If the connection string is not provided.
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 */
const connectDB = async () => {
    if (!DB_CONNECTION_STRING) {
        console.error('Database connection string (DB_URL) is not defined. ❌');
        throw new Error('Missing DB_URL environment variable.');
    }
    try {
        await mongoose.connect(DB_CONNECTION_STRING);
        console.log("Connected successfully. ✅");
    } catch (error) {
        console.error('Error connecting to database. ❌');
        console.error(error);
    }
}

module.exports = connectDB;