const express = require('express');
const router = express.Router();
const {
    createSuggestion,
    getAllSuggestions,
    getUserSuggestions,
    deleteSuggestion
} = require('../controllers/placeSuggestionController');
const auth = require('../middleware/auth');

// Public routes
router.get('/all', getAllSuggestions);
router.get('/', getAllSuggestions);

// Protected routes
router.post('/create', auth, createSuggestion);
router.post('/', auth, createSuggestion);
router.get('/my-suggestions', auth, getUserSuggestions);
router.delete('/:suggestionId', auth, deleteSuggestion);

module.exports = router;
