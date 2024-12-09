const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.getAllTasks);
router.get('/tasks/:id', taskController.getTaskById);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

router.post('/tasks/:id/start', taskController.startTask);
router.post('/tasks/:id/pause', taskController.pauseTask);
router.post('/tasks/:id/stop', taskController.stopTask);

module.exports = router;
