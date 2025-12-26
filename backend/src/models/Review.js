const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5 },
    reviewText: { type: String, trim: true },
    destination: { type: String, trim: true, default: 'General' },
    location: { type: String, trim: true, required: true },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Make sure at least one of reviewText or rating exists, and rating is required if reviewText exists
// Use throwing errors in pre-validate so we don't depend on callback style next()
reviewSchema.pre('validate', function() {
    if (!this.reviewText && (this.rating === undefined || this.rating === null)) {
        throw new Error('Either review text or rating is required');
    }
    if (this.reviewText && (this.rating === undefined || this.rating === null)) {
        throw new Error('Rating is required if review text is provided');
    }
});

module.exports = mongoose.model('Review', reviewSchema);
