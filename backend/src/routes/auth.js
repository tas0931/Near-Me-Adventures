const express = require('express');
const router = express.Router();
const { register, login, me, listUsers, deleteUser, browseUsers } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);
router.get('/users/browse', auth, browseUsers);
router.get('/admin/users', auth, listUsers);
router.delete('/admin/users/:id', auth, deleteUser);

// admin: view specific user's data
const { getUserBookings, getUserWishlist } = require('../controllers/authController');
router.get('/admin/users/:id/bookings', auth, getUserBookings);
router.get('/admin/users/:id/wishlist', auth, getUserWishlist);

module.exports = router;