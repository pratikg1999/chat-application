const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: { type: String, default: '' },
    attachmentUrl: { type: String, default: null },
    readStatus: { type: String, enum: ['process', 'sent', 'delivered', 'seen'], default: 'process' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Messages = mongoose.model('Message', messageSchema);

module.exports = Messages;
