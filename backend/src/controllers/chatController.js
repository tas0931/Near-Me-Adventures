const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');

exports.getMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ createdAt: 1 }).limit(200).populate('sender', 'name email');
    res.json({ messages });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.postMessage = async (req, res) => {
  try {
    if (!req.userId && !req.isAdminToken) return res.status(401).json({ message: 'Unauthorized' });
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ message: 'Missing text' });

    let senderId = req.userId;
    let senderName = 'Admin';
    if (!req.isAdminToken) {
      const user = await User.findById(senderId).select('name');
      if (!user) return res.status(401).json({ message: 'Unauthorized' });
      senderName = user.name;
    }

    const msg = new ChatMessage({ sender: senderId, senderName, text });
    await msg.save();
    res.status(201).json({ message: msg });
  } catch (err) {
    console.error('Post message error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
