const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  recipients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
});

const Conversations = mongoose.model('Conversation', conversationSchema);

module.exports = Conversations;
