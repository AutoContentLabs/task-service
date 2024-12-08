/**
 * @file src/config/database.js
 */
const mongoose = require('mongoose');
const logger = require('../helpers/logger');

// Connect to MongoDB database asynchronously
const connectDB = async () => {

    try {
        // Fetch the MongoDB URI from config
        const mongoURI = process.env.MONGO_URI;

        // If mongoURI is not available in config, log error and exit
        if (!mongoURI) {
            logger.error('Mongo URI not defined in config.');
            process.exit(1);
        }

        // Connect to MongoDB using Mongoose
        await mongoose.connect(mongoURI);

        logger.info('MongoDB connected successfully.');
    } catch (error) {
        // Log the error message and exit the process
        logger.error(`MongoDB connection failed: ${error.message}`);
        process.exit(1); // Exit the process with failure code
    }
};

module.exports = connectDB;
