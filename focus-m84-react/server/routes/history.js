const express = require('express');
const router = express.Router();
const History = require('../models/History');

// GET history (last 50 sessions)
router.get('/', async (req, res) => {
    try {
        const history = await History.find({ userId: 'default' })
            .sort({ timestamp: -1 })
            .limit(50);
        res.json(history.reverse()); // Return in chronological order
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST add history entry
router.post('/', async (req, res) => {
    const historyEntry = new History({
        userId: 'default',
        task: req.body.task,
        estimatedTime: req.body.estimatedTime,
        actualTime: req.body.actualTime,
        status: req.body.status,
        pauses: req.body.pauses || [],
        timestamp: req.body.timestamp || Date.now()
    });

    try {
        const newEntry = await historyEntry.save();

        // Keep only last 50 entries
        const count = await History.countDocuments({ userId: 'default' });
        if (count > 50) {
            const oldestEntries = await History.find({ userId: 'default' })
                .sort({ timestamp: 1 })
                .limit(count - 50);

            const idsToDelete = oldestEntries.map(entry => entry._id);
            await History.deleteMany({ _id: { $in: idsToDelete } });
        }

        res.status(201).json(newEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
