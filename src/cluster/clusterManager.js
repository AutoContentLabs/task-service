/**
 * @file src/cluster/clusterManager.js
 */

/**
 * 
 * @param {*} withCluster 
 * @param {*} service 
 */
function start(withCluster = process.env.NODE_ENV == 'production', service) {
    const cluster = require('cluster');
    const numCPUs = require('os').cpus().length;
    const logger = require("../helpers/logger");
    const createServer = require("./createServer")

    const basePort = process.env.BASE_PORT ? parseInt(process.env.BASE_PORT, 10) : 53100;
    // # Default number of workers: 
    // # If the WORKER_COUNT environmental variable is not defined,
    // # the system automatically starts numCPUs (number of CPUs available) workers.
    const workerCount = process.env.WORKER_COUNT ? parseInt(process.env.WORKER_COUNT, 10) : numCPUs;

    /**
     * Graceful shutdown handler for the application.
     */
    function handleShutdown(id, server) {
        logger.info(`Application [${id}] shutting down...`);
        server.close(() => {
            logger.info("Server has been shut down gracefully.");
            process.exit(0); // Exit the process after the server is closed
        });
    }

    if (withCluster) {

        if (cluster.isMaster) {

            // Start clustering
            for (let i = 0; i < workerCount; i++) {
                cluster.fork();
            }

            cluster.on('exit', (worker, code, signal) => {
                logger.warning(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}`);
                logger.info('Spawning a new worker');
                cluster.fork();
            });

            // Start cluster metrics server
            const { server } = createServer("cluster", basePort);

            // Master process
            process.on("SIGINT", () => handleShutdown({ id: "master", server }));
            process.on("SIGTERM", () => handleShutdown({ id: "master", server }));

        } else {

            // Worker-specific metrics server
            const workerPort = basePort + cluster.worker.id;

            const { server } = createServer("worker", workerPort);

            // Worker process   
            process.on("SIGINT", () => handleShutdown({ id: cluster.worker.id, server }));
            process.on("SIGTERM", () => handleShutdown({ id: cluster.worker.id, server }));

            // Worker process
            service.start();
        }
    } else {
        // Single process mode (for production or non-clustered environments)
        const { server } = createServer("single", basePort);

        // single process
        process.on("SIGINT", () => handleShutdown({ id: "single", server }));
        process.on("SIGTERM", () => handleShutdown({ id: "single", server }));

        // single process
        service.start();
    }
}

module.exports = { start };
