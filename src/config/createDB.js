/**
 * @file src/config/createDB.js
 */
// MongoDB database creator UI
const database = 'TASK_SERVICE';
const collection = 'TASKS';

// Use the specified database or create it if it doesn't exist.
use(database);

// Create a new collection (if it doesn't already exist).
db.createCollection(collection);

// Insert a new document into the collection.
db.getCollection(collection).insertOne({
   
});
