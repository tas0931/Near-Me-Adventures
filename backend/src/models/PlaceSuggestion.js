const mongoose = require('mongoose');

const placeSuggestionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    placeName: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    stateProvince: { type: String, trim: true },
    country: { type: String, required: true, trim: true },
    category: {
        type: String,
        required: true,
        enum: ['adventure', 'beach', 'mountain', 'historical', 'cultural', 'nature', 'urban', 'religious', 'food and dining', 'shopping', 'others']
    },
    description: { type: String, required: true, trim: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('PlaceSuggestion', placeSuggestionSchema);
