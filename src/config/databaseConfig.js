
const mongoose = require('mongoose');
const DB_CONNECTION_STRING = process.env.DB_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(DB_CONNECTION_STRING);
        console.log("Connected successfully. ✅");
    }catch(error){
        console.error('Error connecting to database. ❌');
        console.error(error);
    }
}

module.exports = connectDB;