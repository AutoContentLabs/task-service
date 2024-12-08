/**
 * Create Server
 * @param {*} type 
 * @param {*} port 
 * @returns app server
 */
module.exports = async function createServer(type, port) {
    const logger = require("../helpers/logger")
    const express = require("express")
    const apiRoutes = require('../routes/apiRoutes');
    const promClient = require('prom-client');
    const collectDefaultMetrics = promClient.collectDefaultMetrics;
    collectDefaultMetrics();

    const cors = require('cors');
    const app = express();

    // Middleware for parsing JSON and enabling CORS
    app.use(express.json());
    app.use(cors());

    // Global error handling middleware
    app.use((err, req, res, next) => {
        logger.error(err.message, err.stack);
        res.status(500).json({ message: "Something went wrong!" });
    });

    // Health check route
    app.get('/health', (req, res) => {
        res.status(200).send("OK");
    });

    // Metrics 
    app.get('/metrics', async (req, res) => {
        try {
            const metrics = await promClient.register.metrics(); // Promise çözümü
            res.setHeader('Content-Type', promClient.register.contentType);
            res.end(metrics);
        } catch (error) {
            res.writeHead(500);
            res.end('Error collecting metrics');
            logger.error('Error collecting metrics:', error);
        }
    });

    // apiRoutes
    app.use('/api', apiRoutes);

    // Start the server
    app.listen(port, () => {
        logger.notice(`Starting in ${type} mode. Listening on http://localhost:${port}/health`);
    });

    return app;
}

// Graceful shutdown
function handleShutdown() {
    logger.info("Application shutting down...");
    process.exit(0);
}

process.on("SIGINT", handleShutdown); // Handle Ctrl+C
process.on("SIGTERM", handleShutdown); // Handle termination signals
