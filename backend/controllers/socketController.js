const dbUtils = require('../utils/dbUtils');

function getRoomName(id, channel) {
  return id + channel;
}

module.exports = function (io) {
  io.on('connection', async function (socket) {
    socket.USER_ID = socket.handshake.query.userId;
    socket.join(getRoomName(socket.USER_ID, '-message-transfer'));
    try {
      socket.USER = await dbUtils.findPlainUserById(socket.USER_ID);
    } catch (err) {
      console.log(err);
    }

    socket.on('get-user', async (callback) => {
      try {
        const user = await dbUtils.findUserById(socket.USER_ID);
        socket.USER.connections.map((connection) => {
          socket.join(getRoomName(connection._id, '-status-transfer'));
        });
        callback({ user });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('get-conversations', async (callback) => {
      try {
        const conversations = await dbUtils.findConversations(socket.USER_ID);
        callback({ conversations });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('status-update', async () => {
      try {
        const user = await dbUtils.updateStatus(socket.USER_ID, { status: 'online', lastSeen: null });
        socket.to(getRoomName(socket.USER_ID, '-status-transfer')).emit('status-update', { user: user });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('send-message', async (body, callback) => {
      try {
        const message = await dbUtils.saveMessage(body);
        socket.to(getRoomName(message.receiver, '-message-transfer')).emit('message-added', message);
        callback({ message });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('get-users', async (callback) => {
      try {
        const users = await dbUtils.getAllUsersExceptMe(socket.USER_ID);
        callback({ users });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('add-connection', async (peerUser, callback) => {
      try {
        if (socket.USER.connections.indexOf(peerUser._id) === -1) {
          const user = await dbUtils.addConnection(socket.USER_ID, peerUser);
          socket.join(getRoomName(peerUser._id, '-status-transfer'));
          socket.to(getRoomName(peerUser._id, '-message-transfer')).emit('connection-added');
          callback({ user });
        } else {
          callback({ user: socket.USER });
        }
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('typing', (receiverId) => {
      socket.to(getRoomName(receiverId, '-message-transfer')).emit('typing', socket.USER_ID);
    });

    socket.on('edit-message', async (message, callback) => {
      try {
        const updatedMessage = await dbUtils.updateMessage(message);
        if (socket.USER_ID == message.sender) {
          socket.to(getRoomName(message.receiver, '-message-transfer')).emit('edit-message', updatedMessage);
        } else {
          socket.to(getRoomName(message.sender, '-message-transfer')).emit('edit-message', updatedMessage);
        }
        callback({ message: updatedMessage });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('delivered-all', async () => {
      await dbUtils.markDeliveredAll(socket.USER_ID);
      socket.to(getRoomName(socket.USER_ID, '-status-transfer')).emit('delivered-all', socket.USER_ID);
    });

    socket.on('disconnecting', async () => {
      const user = await dbUtils.updateStatus(socket.USER_ID, { status: 'offline', lastSeen: Date.now() });
      socket.to(getRoomName(socket.USER_ID, '-status-transfer')).emit('status-update', { user: user });
    });
  });
};
