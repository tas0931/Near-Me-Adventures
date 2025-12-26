const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // optional: control strictQuery if you relied on old behavior
        mongoose.set('strictQuery', false);

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;