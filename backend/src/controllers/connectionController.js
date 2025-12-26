const Connection = require('../models/Connection');
const User = require('../models/User');

exports.sendConnectionRequest = async (req, res) => {
    try {
        const requesterId = req.userId;
        const { recipientId } = req.body;

        if (!recipientId) {
            return res.status(400).json({ message: 'Recipient ID is required' });
        }

        if (requesterId === recipientId) {
            return res.status(400).json({ message: 'Cannot send connection request to yourself' });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingConnection = await Connection.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (existingConnection) {
            if (existingConnection.status === 'accepted') {
                return res.status(400).json({ message: 'You are already connected' });
            }
            if (existingConnection.status === 'pending') {
                return res.status(400).json({ message: 'Connection request already sent' });
            }
        }

        const connection = new Connection({
            requester: requesterId,
            recipient: recipientId,
            status: 'pending'
        });

        await connection.save();

        res.status(201).json({ 
            message: 'Connection request sent successfully',
            connection 
        });
    } catch (error) {
        console.error('Error sending connection request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.acceptConnectionRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const { connectionId } = req.params;

        const connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(404).json({ message: 'Connection request not found' });
        }

        if (connection.recipient.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to accept this request' });
        }

        if (connection.status !== 'pending') {
            return res.status(400).json({ message: 'Connection request is not pending' });
        }

        connection.status = 'accepted';
        await connection.save();

        res.json({ 
            message: 'Connection request accepted',
            connection 
        });
    } catch (error) {
        console.error('Error accepting connection request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.rejectConnectionRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const { connectionId } = req.params;

        const connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(404).json({ message: 'Connection request not found' });
        }

        if (connection.recipient.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to reject this request' });
        }

        if (connection.status !== 'pending') {
            return res.status(400).json({ message: 'Connection request is not pending' });
        }

        connection.status = 'rejected';
        await connection.save();

        res.json({ 
            message: 'Connection request rejected',
            connection 
        });
    } catch (error) {
        console.error('Error rejecting connection request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getPendingRequests = async (req, res) => {
    try {
        const userId = req.userId;

        const pendingRequests = await Connection.find({
            recipient: userId,
            status: 'pending'
        })
        .populate('requester', 'name email')
        .sort({ createdAt: -1 });

        res.json({ 
            pendingRequests,
            count: pendingRequests.length 
        });
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getSentRequests = async (req, res) => {
    try {
        const userId = req.userId;

        const sentRequests = await Connection.find({
            requester: userId,
            status: 'pending'
        })
        .populate('recipient', 'name email')
        .sort({ createdAt: -1 });

        res.json({ 
            sentRequests,
            count: sentRequests.length 
        });
    } catch (error) {
        console.error('Error fetching sent requests:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getFriends = async (req, res) => {
    try {
        const userId = req.userId;

        const connections = await Connection.find({
            $or: [
                { requester: userId, status: 'accepted' },
                { recipient: userId, status: 'accepted' }
            ]
        })
        .populate('requester', 'name email')
        .populate('recipient', 'name email')
        .sort({ updatedAt: -1 });

        const friends = connections.map(conn => {
            if (conn.requester._id.toString() === userId) {
                return conn.recipient;
            } else {
                return conn.requester;
            }
        });

        res.json({ 
            friends,
            count: friends.length 
        });
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.removeFriend = async (req, res) => {
    try {
        const userId = req.userId;
        const { friendId } = req.params;

        const connection = await Connection.findOne({
            $or: [
                { requester: userId, recipient: friendId, status: 'accepted' },
                { requester: friendId, recipient: userId, status: 'accepted' }
            ]
        });

        if (!connection) {
            return res.status(404).json({ message: 'Friendship not found' });
        }

        await Connection.deleteOne({ _id: connection._id });

        res.json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.cancelConnectionRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const { connectionId } = req.params;

        const connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(404).json({ message: 'Connection request not found' });
        }

        if (connection.requester.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to cancel this request' });
        }

        if (connection.status !== 'pending') {
            return res.status(400).json({ message: 'Can only cancel pending requests' });
        }

        await Connection.deleteOne({ _id: connection._id });

        res.json({ message: 'Connection request cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling connection request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getConnectionStatus = async (req, res) => {
    try {
        const userId = req.userId;
        const { otherUserId } = req.params;

        const connection = await Connection.findOne({
            $or: [
                { requester: userId, recipient: otherUserId },
                { requester: otherUserId, recipient: userId }
            ]
        });

        if (!connection) {
            return res.json({ status: 'none' });
        }

        const isRequester = connection.requester.toString() === userId;

        res.json({ 
            status: connection.status,
            isRequester,
            connectionId: connection._id
        });
    } catch (error) {
        console.error('Error getting connection status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
