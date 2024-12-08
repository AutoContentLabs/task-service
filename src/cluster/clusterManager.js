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

    const basePort = process.env.BASE_PORT ? parseInt(process.env.BASE_PORT, 10) : 50000;
    // # Default number of workers: 
    // # If the WORKER_COUNT environmental variable is not defined,
    // # the system automatically starts numCPUs (number of CPUs available) workers.
    const workerCount = process.env.WORKER_COUNT ? parseInt(process.env.WORKER_COUNT, 10) : numCPUs;

    /**
     * Graceful shutdown handler for the application.
     */
    function handleShutdown(id) {
        logger.info(`Application [${id}] shutting down...`);
        process.exit(0);
    }

    if (withCluster) {

        if (cluster.isMaster) {
            // Master process
            process.on("SIGINT", () => handleShutdown("master"));
            process.on("SIGTERM", () => handleShutdown("master"));

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
            createServer("cluster", basePort);

        } else {
            // Worker process   
            process.on("SIGINT", () => handleShutdown(cluster.worker.id));
            process.on("SIGTERM", () => handleShutdown(cluster.worker.id));

            // Worker-specific metrics server
            const workerPort = basePort + cluster.worker.id;
            createServer("worker", workerPort);

            // Worker process
            service.start();
        }
    } else {
        // Single process mode (for production or non-clustered environments)
        createServer("single", basePort);
        service.start();
    }
}

module.exports = { start };
