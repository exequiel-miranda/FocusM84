const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create task
router.post('/', async (req, res) => {
    const task = new Task({
        name: req.body.name,
        estimatedTime: req.body.estimatedTime
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update task
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        if (req.body.name) task.name = req.body.name;
        if (req.body.estimatedTime) task.estimatedTime = req.body.estimatedTime;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        await task.deleteOne();
        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
