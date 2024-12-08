/**
 * @file src/app.js
 */

const fn = require('./services/fn');
const { start } = require("./cluster/clusterManager")
start(process.env.NODE_ENV == 'production', fn)