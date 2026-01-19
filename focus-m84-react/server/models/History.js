const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: {
        type: String,
        default: 'default'
    },
    task: {
        type: String,
        required: true
    },
    estimatedTime: {
        type: Number,
        required: true
    },
    actualTime: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['completed', 'failed'],
        required: true
    },
    pauses: [
        {
            reason: String,
            duration: Number, // In seconds
            timestamp: { type: Date, default: Date.now }
        }
    ],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient queries
historySchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('History', historySchema);
