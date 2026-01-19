const mongoose = require('mongoose');

const pauseReasonSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PauseReason', pauseReasonSchema);
