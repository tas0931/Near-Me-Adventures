const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getPendingRequests,
    getSentRequests,
    getFriends,
    removeFriend,
    cancelConnectionRequest,
    getConnectionStatus
} = require('../controllers/connectionController');

router.post('/send', auth, sendConnectionRequest);
router.put('/accept/:connectionId', auth, acceptConnectionRequest);
router.put('/reject/:connectionId', auth, rejectConnectionRequest);
router.delete('/cancel/:connectionId', auth, cancelConnectionRequest);
router.get('/pending', auth, getPendingRequests);
router.get('/sent', auth, getSentRequests);
router.get('/friends', auth, getFriends);
router.delete('/friend/:friendId', auth, removeFriend);
router.get('/status/:otherUserId', auth, getConnectionStatus);

module.exports = router;
