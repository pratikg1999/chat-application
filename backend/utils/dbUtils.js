const userModel = require('../models/userModel');
const conversationModel = require('../models/conversationModel');
const messageModel = require('../models/messageModel');
const Conversations = require('../models/conversationModel');

const addConnection = async (userId, peerUser) => {
  try {
    let user = await userModel.findById(userId);
    let peer = await userModel.findById(peerUser._id);
    const conversation = new conversationModel({ recipients: [userId, peerUser._id], messages: [] });
    await conversation.save();
    peer.connections.push(userId);
    user.connections.push(peerUser._id);
    await peer.save();
    await user.save();
    return await userModel.findById(userId).populate('connections');
  } catch (err) {
    console.log(err);
  }
};

const findPlainUserById = async (userId) => {
  try {
    return await userModel.findById(userId);
  } catch (err) {
    console.log(err);
    return {};
  }
};

const findUserById = async (userId) => {
  try {
    return await userModel.findById(userId).populate('connections');
  } catch (err) {
    console.log(err);
    return {};
  }
};

const findConversations = async (userId) => {
  try {
    let conversations = await conversationModel
      .find({ recipients: userId })
      .populate('recipients')
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User',
        },
      });
    return conversations;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getAllUsersExceptMe = async (userId) => {
  try {
    return await userModel.find({ _id: { $ne: userId } });
  } catch (err) {
    console.log(err);
    return [];
  }
};

const register = (userData, password, callback) => {
  userModel.register(new userModel(userData), password, (err, user) => {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      user.save((err, user) => {
        callback(err, user);
      });
    }
  });
};

const saveMessage = async (message) => {
  try {
    message.readStatus = 'sent';
    let newMessage = new messageModel(message);
    newMessage = await newMessage.save();
    let conversation = await Conversations.findOne({ recipients: { $all: [message.sender, message.receiver] } });
    conversation.messages.push(newMessage._id);
    await conversation.save();
    newMessage = await newMessage.populate('sender').execPopulate();
    return newMessage;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const updateStatus = async (userId, body) => {
  try {
    return await userModel.findOneAndUpdate({ _id: userId }, { $set: body }, { new: true }).populate('connections');
  } catch (err) {
    console.log(err);
    return {};
  }
};

const updateMessage = async (message) => {
  const messageId = message._id;
  delete message._id;
  let updatedMessage = await messageModel.findOneAndUpdate({ _id: messageId }, { ...message }, { new: true });
  updatedMessage = await updatedMessage.populate('sender').execPopulate();
  return updatedMessage;
};

const markDeliveredAll = async (userId) => {
  await messageModel.updateMany({ receiver: userId, readStatus: 'sent' }, { status: 'delivered' });
};

module.exports = {
  addConnection,
  findPlainUserById,
  findUserById,
  findConversations,
  getAllUsersExceptMe,
  register,
  saveMessage,
  updateStatus,
  updateMessage,
  markDeliveredAll,
};
