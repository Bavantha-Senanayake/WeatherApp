const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        const conn =  mongoose.connect(process.env.MONGODB_URL);
        
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

module.exports = dbConnect;
