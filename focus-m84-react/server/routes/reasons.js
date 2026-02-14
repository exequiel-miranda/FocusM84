const express = require('express');
const router = express.Router();
const PauseReason = require('../models/PauseReason');

// Seed default reasons if none exist
const seedDefaults = async () => {
    const count = await PauseReason.countDocuments();
    if (count === 0) {
        const defaults = [
            { text: 'Ir al baño', isDefault: true },
            { text: 'Urgencia familiar', isDefault: true },
            { text: 'Hidratación vital', isDefault: true },
            { text: 'Atención a la puerta', isDefault: true }
        ];
        await PauseReason.insertMany(defaults);
        console.log('✅ Motivos de pausa por defecto sembrados');
    }
};



// GET all reasons
router.get('/', async (req, res) => {
    try {
        const reasons = await PauseReason.find().sort({ createdAt: 1 });
        res.json(reasons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST add a new reason
router.post('/', async (req, res) => {
    const reason = new PauseReason({
        text: req.body.text,
        isDefault: false
    });

    try {
        const newReason = await reason.save();
        res.status(201).json(newReason);
    } catch (error) {
        // If it already exists, just return the existing one or 400
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Este motivo ya existe' });
        }
        res.status(400).json({ message: error.message });
    }
});

module.exports = { router, seedDefaults };
