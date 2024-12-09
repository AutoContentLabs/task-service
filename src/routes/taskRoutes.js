const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/tasks', taskController.create);
router.put('/tasks/:id', taskController.update);
router.delete('/tasks/:id', taskController.deleteById);
router.get('/tasks/:id', taskController.getById);
router.get('/tasks', taskController.getAll);

router.post('/tasks/:id/start', taskController.start);
router.post('/tasks/:id/stop', taskController.stop);
router.post('/tasks/:id/pause', taskController.pause);
router.post('/tasks/:id/pause', taskController.resume);
router.post('/tasks/:id/pause', taskController.restart);

module.exports = router;
