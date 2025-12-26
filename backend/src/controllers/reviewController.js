const Review = require('../models/Review');
const User = require('../models/User');

exports.createReview = async (req, res) => {
    try {
        console.log('📝 Creating review for user:', req.userId);
        const { rating, reviewText, destination, location } = req.body;
        const userId = req.userId;

        // Location is required
        if (!location || !location.trim()) {
            return res.status(400).json({ message: 'Location is required' });
        }

        // Validation: if reviewText is provided, rating must be provided
        if (reviewText && !rating) {
            return res.status(400).json({ message: 'Rating is required if review text is provided' });
        }

        // At least one of rating or reviewText must be provided
        if (!rating && !reviewText) {
            return res.status(400).json({ message: 'Either rating or review text is required' });
        }

        const review = new Review({
            userId,
            rating: rating || null,
            reviewText: reviewText || null,
            destination: destination || 'General',
            location: location.trim()
        });

        await review.save();
        
        // Populate user data
        await review.populate('userId', 'name profilePicture email');
        
        console.log('✅ Review created:', review._id);
        res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
        console.error('❌ createReview error:', error && error.stack ? error.stack : error);
        res.status(500).json({ message: error.message || 'Failed to create review' });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        console.log('📝 Fetching all reviews...');
        const reviews = await Review.find()
            .populate('userId', 'name profilePicture email')
            .sort({ createdAt: -1 });

        console.log(`✅ Found ${reviews.length} reviews`);
        res.json({ reviews });
    } catch (error) {
        console.error('❌ getAllReviews error:', error && error.stack ? error.stack : error);
        res.status(500).json({ message: error.message || 'Failed to fetch reviews' });
    }
};

exports.getUserReviews = async (req, res) => {
    try {
        const userId = req.userId;
        const reviews = await Review.find({ userId })
            .populate('userId', 'name profilePicture email')
            .sort({ createdAt: -1 });

        res.json({ reviews });
    } catch (error) {
        console.error('getUserReviews error:', error && error.stack ? error.stack : error);
        res.status(500).json({ message: error.message || 'Failed to fetch reviews' });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, reviewText } = req.body;
        const userId = req.userId;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }

        // Validation
        if (reviewText && !rating) {
            return res.status(400).json({ message: 'Rating is required if review text is provided' });
        }

        if (rating) review.rating = rating;
        if (reviewText !== undefined) review.reviewText = reviewText;

        await review.save();
        await review.populate('userId', 'name profilePicture email');

        res.json({ message: 'Review updated successfully', review });
    } catch (error) {
        console.error('updateReview error:', error && error.stack ? error.stack : error);
        res.status(500).json({ message: error.message || 'Failed to update review' });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.userId;

        console.log('🗑️  Delete review request:');
        console.log('   Review ID:', reviewId);
        console.log('   User ID:', userId);
        console.log('   Is Admin Token:', req.isAdminToken);

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        console.log('   Review Owner ID:', review.userId?.toString());

        // Allow deletion if the request is from the review owner or an admin token
        if (!req.isAdminToken && (!userId || review.userId.toString() !== userId)) {
            console.log('❌ Authorization failed - Not admin and not owner');
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        console.log('✅ Authorization passed - Deleting review');
        await Review.findByIdAndDelete(reviewId);
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('deleteReview error:', error && error.stack ? error.stack : error);
        res.status(500).json({ message: error.message || 'Failed to delete review' });
    }
};
