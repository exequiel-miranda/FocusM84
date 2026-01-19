const express = require('express');
const router = express.Router();
const Stats = require('../models/Stats');

// GET stats
router.get('/', async (req, res) => {
    try {
        let stats = await Stats.findOne({ userId: 'default' });

        if (!stats) {
            // Create default stats if none exist
            stats = new Stats({
                userId: 'default',
                completed: 0,
                failed: 0,
                totalFocusTime: 0,
                completionRate: 0
            });
            await stats.save();
        }

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update stats
router.put('/', async (req, res) => {
    try {
        let stats = await Stats.findOne({ userId: 'default' });

        if (!stats) {
            stats = new Stats({ userId: 'default' });
        }

        if (req.body.completed !== undefined) stats.completed = req.body.completed;
        if (req.body.failed !== undefined) stats.failed = req.body.failed;
        if (req.body.totalFocusTime !== undefined) stats.totalFocusTime = req.body.totalFocusTime;
        if (req.body.completionRate !== undefined) stats.completionRate = req.body.completionRate;

        stats.updatedAt = Date.now();

        const updatedStats = await stats.save();
        res.json(updatedStats);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
