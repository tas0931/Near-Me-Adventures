const User = require('../models/User');

exports.getWishlist = async (req, res) => {
  try {
    if (!req.userId && !req.isAdminToken) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(req.userId).select('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ wishlist: user.wishlist || [] });
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    if (!req.userId && !req.isAdminToken) return res.status(401).json({ message: 'Unauthorized' });
    const { itemId, title, img, duration, price } = req.body || {};
    if (!itemId || !title) return res.status(400).json({ message: 'Missing itemId or title' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // prevent duplicates by itemId
    const exists = (user.wishlist || []).some(w => w.itemId === String(itemId));
    if (exists) return res.status(200).json({ wishlist: user.wishlist });

    user.wishlist = user.wishlist || [];
    user.wishlist.push({ itemId: String(itemId), title, img, duration, price });
    await user.save();
    res.status(201).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error('Add wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    if (!req.userId && !req.isAdminToken) return res.status(401).json({ message: 'Unauthorized' });
    const itemId = req.params.id;
    if (!itemId) return res.status(400).json({ message: 'Missing item id' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.wishlist = (user.wishlist || []).filter(w => w.itemId !== String(itemId));
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    console.error('Remove wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
