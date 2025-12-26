const User = require('../models/User');

exports.getTrending = async (req, res) => {
  try {
    // Aggregate top booked items across all users
    const topBooked = await User.aggregate([
      { $unwind: '$bookings' },
      {
        $group: {
          _id: '$bookings.itemId',
          title: { $first: '$bookings.title' },
          img: { $first: '$bookings.img' },
          duration: { $first: '$bookings.duration' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    // Aggregate top wishlisted items across all users
    const topWishlisted = await User.aggregate([
      { $unwind: '$wishlist' },
      {
        $group: {
          _id: '$wishlist.itemId',
          title: { $first: '$wishlist.title' },
          img: { $first: '$wishlist.img' },
          duration: { $first: '$wishlist.duration' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    res.json({
      topBooked: topBooked.map(b => ({ itemId: b._id, title: b.title, img: b.img, duration: b.duration, count: b.count })),
      topWishlisted: topWishlisted.map(w => ({ itemId: w._id, title: w.title, img: w.img, duration: w.duration, count: w.count }))
    });
  } catch (err) {
    console.error('Trending fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
