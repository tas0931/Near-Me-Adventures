const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTrending } = require('../controllers/trendingController');

router.get('/', auth, getTrending);

module.exports = router;
