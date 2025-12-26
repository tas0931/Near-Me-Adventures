const express = require('express');
const router = express.Router();
const { 
    createReview, 
    getAllReviews, 
    getUserReviews, 
    updateReview, 
    deleteReview 
} = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Public routes
router.get('/all', getAllReviews);
// also support GET / -> fetch all reviews (friendly API for frontend)
router.get('/', getAllReviews);

// Protected routes (use JWT auth middleware, not Supabase)
router.post('/create', auth, createReview);
// also support POST / -> create review (frontend posts to /api/reviews)
router.post('/', auth, createReview);
router.get('/my-reviews', auth, getUserReviews);
router.put('/:reviewId', auth, updateReview);
router.delete('/:reviewId', auth, deleteReview);

module.exports = router;
