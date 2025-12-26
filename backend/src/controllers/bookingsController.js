const User = require('../models/User');

exports.getBookings = async (req, res) => {
  try {
    if (!req.userId && !req.isAdminToken) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(req.userId).select('bookings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ bookings: user.bookings || [] });
  } catch (err) {
    console.error('Get bookings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addBooking = async (req, res) => {
  try {
    if (!req.userId && !req.isAdminToken) return res.status(401).json({ message: 'Unauthorized' });
    const { itemId, title, img, duration, price, priceLabel } = req.body || {};
    if (!itemId || !title) return res.status(400).json({ message: 'Missing itemId or title' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.bookings = user.bookings || [];
    const exists = user.bookings.find(b => b.itemId === String(itemId));
    if (exists) return res.status(200).json({ bookings: user.bookings });

    const priceNum = typeof price === 'number' ? price : (Number(price) || 0);
    user.bookings.push({ itemId: String(itemId), title, img, duration, price: priceNum, priceLabel, paid: false });
    await user.save();
    res.status(201).json({ bookings: user.bookings });
  } catch (err) {
    console.error('Add booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeBooking = async (req, res) => {
  try {
    if (!req.userId && !req.isAdminToken) return res.status(401).json({ message: 'Unauthorized' });
    const itemId = req.params.id;
    if (!itemId) return res.status(400).json({ message: 'Missing item id' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.bookings = (user.bookings || []).filter(b => b.itemId !== String(itemId));
    await user.save();
    res.json({ bookings: user.bookings });
  } catch (err) {
    console.error('Remove booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.payBooking = async (req, res) => {
  try {
    if (!req.userId && !req.isAdminToken) return res.status(401).json({ message: 'Unauthorized' });
    const itemId = req.params.id;
    if (!itemId) return res.status(400).json({ message: 'Missing item id' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.bookings = user.bookings || [];
    const booking = user.bookings.find(b => b.itemId === String(itemId));
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.paid) return res.status(200).json({ bookings: user.bookings, message: 'Already paid' });

    // mock payment processing: generate a simple payment id and mark as paid
    booking.paid = true;
    booking.paidAt = new Date();
    booking.paymentId = `PAY_${Date.now()}`;

    await user.save();
    res.json({ bookings: user.bookings, paymentId: booking.paymentId });
  } catch (err) {
    console.error('Pay booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
