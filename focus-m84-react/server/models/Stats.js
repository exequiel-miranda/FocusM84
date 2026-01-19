const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: 'default',
        unique: true
    },
    completed: {
        type: Number,
        default: 0
    },
    failed: {
        type: Number,
        default: 0
    },
    totalFocusTime: {
        type: Number,
        default: 0
    },
    completionRate: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Stats', statsSchema);
