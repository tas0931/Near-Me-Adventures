const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    sendDirectMessage,
    getConversation,
    getConversations,
    getUnreadCount,
    markAsRead,
    deleteMessage
} = require('../controllers/directMessageController');

router.post('/send', auth, sendDirectMessage);
router.get('/conversations', auth, getConversations);
router.get('/conversation/:otherUserId', auth, getConversation);
router.get('/unread-count', auth, getUnreadCount);
router.put('/mark-read/:otherUserId', auth, markAsRead);
router.delete('/:messageId', auth, deleteMessage);

module.exports = router;
