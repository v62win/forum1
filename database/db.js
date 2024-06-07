const mongoose = require('mongoose');

const connectDB = async () => {
    const MONGO_URI = "mongodb+srv://Jetblackwings:tkm00dark@cluster0.ol27zjr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    try {
        const conn = await mongoose.connect(MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;
