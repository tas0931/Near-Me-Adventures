const mongoose = require('mongoose');

const directMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Index for efficient queries
directMessageSchema.index({ sender: 1, recipient: 1 });
directMessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('DirectMessage', directMessageSchema);
