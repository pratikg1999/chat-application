import MessageReadStatus from "./MessageReadStatus";

export const findConversationId = (message, loggedInUserId) => {
  if (message.sender._id === loggedInUserId) {
    return message.receiver;
  } else {
    return message.sender._id;
  }
};
export const calcUnreadCounts = (messages, loggedInUserId) => {
  let count = 0;
  for (let msg of messages) {
    if (
      !msg.isDeleted &&
      msg.receiver === loggedInUserId &&
      [MessageReadStatus.SENT, MessageReadStatus.DELIVERED].includes(
        msg.readStatus
      )
    ) {
      count += 1;
    }
  }
  return count;
};

export const formatMessageForServer = (message) => {
  message = { ...message };
  message.sender = message.sender._id;
  return message;
};
