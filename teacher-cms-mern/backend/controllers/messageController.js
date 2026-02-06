const { Conversation, Message } = require('../models/Message');
const User = require('../models/User');

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate('participants', 'name email avatar')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'name' }
      })
      .sort('-updatedAt');

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({ success: false, message: 'Participant ID is required' });
    }

    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, participantId] }
    }).populate('participants', 'name email avatar');

    if (conversation) {
      return res.status(200).json({
        success: true,
        data: conversation
      });
    }

    conversation = await Conversation.create({
      participants: [req.user.id, participantId]
    });

    conversation = await Conversation.findById(conversation._id)
      .populate('participants', 'name email avatar');

    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name email avatar')
      .sort('sentAt');

    await Message.updateMany(
      { conversation: req.params.id, sender: { $ne: req.user.id }, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const message = await Message.create({
      conversation: req.params.id,
      sender: req.user.id,
      content: content.trim()
    });

    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date();
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email avatar');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    });

    const conversationIds = conversations.map(c => c._id);

    const unreadCount = await Message.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: req.user.id },
      isRead: false
    });

    res.status(200).json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
