const DirectMessage = require('../models/DirectMessage');
const User = require('../models/User');
const Connection = require('../models/Connection');

// Send a direct message
exports.sendDirectMessage = async (req, res) => {
    try {
        const senderId = req.userId;
        const { recipientId, text } = req.body;

        if (!recipientId || !text) {
            return res.status(400).json({ message: 'Recipient ID and text are required' });
        }

        // Check if users are friends
        const connection = await Connection.findOne({
            $or: [
                { requester: senderId, recipient: recipientId, status: 'accepted' },
                { requester: recipientId, recipient: senderId, status: 'accepted' }
            ]
        });

        if (!connection) {
            return res.status(403).json({ message: 'You can only message friends' });
        }

        // Check if recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        const message = new DirectMessage({
            sender: senderId,
            recipient: recipientId,
            text: text.trim()
        });

        await message.save();

        // Populate sender info for response
        await message.populate('sender', 'name email');

        res.status(201).json({ 
            message: 'Message sent successfully',
            data: message 
        });
    } catch (error) {
        console.error('Error sending direct message:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get conversation with a specific user
exports.getConversation = async (req, res) => {
    try {
        const userId = req.userId;
        const { otherUserId } = req.params;

        if (!otherUserId) {
            return res.status(400).json({ message: 'Other user ID is required' });
        }

        // Get all messages between these two users
        const messages = await DirectMessage.find({
            $or: [
                { sender: userId, recipient: otherUserId },
                { sender: otherUserId, recipient: userId }
            ]
        })
        .populate('sender', 'name email')
        .populate('recipient', 'name email')
        .sort({ createdAt: 1 })
        .limit(500);

        // Mark messages as read
        await DirectMessage.updateMany(
            { sender: otherUserId, recipient: userId, read: false },
            { read: true }
        );

        res.json({ 
            messages,
            count: messages.length 
        });
    } catch (error) {
        console.error('Error getting conversation:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all conversations (list of users you've chatted with)
exports.getConversations = async (req, res) => {
    try {
        const userId = req.userId;

        // Get all messages where user is sender or recipient
        const messages = await DirectMessage.find({
            $or: [{ sender: userId }, { recipient: userId }]
        })
        .populate('sender', 'name email')
        .populate('recipient', 'name email')
        .sort({ createdAt: -1 });

        // Get unique users and their last message
        const conversationsMap = new Map();

        for (const msg of messages) {
            const otherUser = msg.sender._id.toString() === userId 
                ? msg.recipient 
                : msg.sender;
            
            const otherUserId = otherUser._id.toString();

            if (!conversationsMap.has(otherUserId)) {
                // Count unread messages from this user
                const unreadCount = await DirectMessage.countDocuments({
                    sender: otherUserId,
                    recipient: userId,
                    read: false
                });

                conversationsMap.set(otherUserId, {
                    user: otherUser,
                    lastMessage: msg.text,
                    lastMessageTime: msg.createdAt,
                    unreadCount
                });
            }
        }

        const conversations = Array.from(conversationsMap.values())
            .sort((a, b) => b.lastMessageTime - a.lastMessageTime);

        res.json({ 
            conversations,
            count: conversations.length 
        });
    } catch (error) {
        console.error('Error getting conversations:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.userId;

        const unreadCount = await DirectMessage.countDocuments({
            recipient: userId,
            read: false
        });

        res.json({ unreadCount });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Mark conversation as read
exports.markAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        const { otherUserId } = req.params;

        await DirectMessage.updateMany(
            { sender: otherUserId, recipient: userId, read: false },
            { read: true }
        );

        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
    try {
        const userId = req.userId;
        const { messageId } = req.params;

        const message = await DirectMessage.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Only sender can delete
        if (message.sender.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this message' });
        }

        await DirectMessage.deleteOne({ _id: messageId });

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
