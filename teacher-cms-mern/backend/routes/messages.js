const express = require('express');
const {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.post('/conversations', protect, createConversation);
router.get('/conversations/:id', protect, getMessages);
router.post('/conversations/:id', protect, sendMessage);
router.get('/unread', protect, getUnreadCount);

module.exports = router;
