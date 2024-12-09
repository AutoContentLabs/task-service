const express = require('express');
const router = express.Router();
const { create, update, deleteById, getById, getAll, start, stop, pause, resume, restart } = require('../controllers/taskController');

router.post('/tasks', create);
router.put('/tasks/:id', update);
router.delete('/tasks/:id', deleteById);
router.get('/tasks/:id', getById);
router.get('/tasks', getAll);

router.post('/tasks/:id/start', start);
router.post('/tasks/:id/stop', stop);
router.post('/tasks/:id/pause', pause);
router.post('/tasks/:id/pause', resume);
router.post('/tasks/:id/pause', restart);

module.exports = router;
