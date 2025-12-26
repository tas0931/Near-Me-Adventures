const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getBookings, addBooking, removeBooking, payBooking } = require('../controllers/bookingsController');

router.get('/', auth, getBookings);
router.post('/', auth, addBooking);
router.delete('/:id', auth, removeBooking);
router.post('/:id/pay', auth, payBooking);

module.exports = router;
