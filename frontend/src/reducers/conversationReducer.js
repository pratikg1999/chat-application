import {
  ADD_MESSAGE,
  ADD_NEW_CONVERSATION,
  DELETE_MESSAGE,
  EDIT_MESSAGE,
  MARK_DELIVERED_ALL,
  SET_ACTIVE_CONVERSATION,
  TYPING,
  UPDATE_STATUS,
  GET_CONVERSATIONS,
  CLEAR_CONVERSATIONS_DATA,
} from "../actions/types";
import MessageReadStatus from "../utils/MessageReadStatus";
import { calcUnreadCounts } from "../utils/utils";

const initialState = {
  activeConversation: "",
  conversations: {},
};

export default function conversationReducer(state = initialState, action) {
  let ind;
  let conversations;
  switch (action.type) {
    case GET_CONVERSATIONS:
      conversations = {};
      for (let conversation of action.conversations) {
        let curReceiver = conversation.recipients.find(
          (user) => user._id !== action.loggedInUserId
        );
        let curCon = {
          receiver: { ...curReceiver, isTyping: false },
          messages: conversation.messages,
          unreadCount: calcUnreadCounts(
            conversation.messages,
            action.loggedInUserId
          ),
        };
        conversations[curReceiver._id] = curCon;
      }
      return { ...state, conversations: conversations };
    case SET_ACTIVE_CONVERSATION:
      return { ...state, activeConversation: action.receiver._id };
    case ADD_NEW_CONVERSATION:
      const newConversation = {
        receiver: action.receiver,
        messages: [],
        unreadCount: 0,
      };
      state.conversations[action.receiver._id] = newConversation;
      state.conversations = { ...state.conversations };
      state = { ...state };
      return state;
    case ADD_MESSAGE:
      state.conversations[action.conversationId].messages.push(action.message);
      if (
        action.message.sender._id === action.conversationId &&
        [MessageReadStatus.DELIVERED, MessageReadStatus.SENT].includes(
          action.message.readStatus
        )
      ) {
        state.conversations[action.conversationId].unreadCount += 1;
      }
      state.conversations[action.conversationId].messages = [
        ...state.conversations[action.conversationId].messages,
      ];
      state.conversations[action.conversationId] = {
        ...state.conversations[action.conversationId],
      };
      state.conversations = { ...state.conversations };
      state = { ...state };
      return state;
    case EDIT_MESSAGE:
      if (action.localId) {
        ind = state.conversations[action.conversationId].messages.findIndex(
          (msg) => msg.localId === action.localId
        );
      } else {
        ind = state.conversations[action.conversationId].messages.findIndex(
          (msg) => msg._id === action.message._id
        );
      }
      if (
        !state.conversations[action.conversationId].messages[ind].isDeleted &&
        action.message.sender._id === action.conversationId &&
        state.conversations[action.conversationId].messages[ind].readStatus !==
          MessageReadStatus.SEEN &&
        (action.message.readStatus === MessageReadStatus.SEEN ||
          action.message.isDeleted)
      ) {
        state.conversations[action.conversationId].unreadCount -= 1;
      }
      state.conversations[action.conversationId].messages[ind] = action.message;
      state.conversations[action.conversationId].messages = [
        ...state.conversations[action.conversationId].messages,
      ];
      state.conversations[action.conversationId] = {
        ...state.conversations[action.conversationId],
      };
      state.conversations = { ...state.conversations };
      state = { ...state };
      return state;
    case DELETE_MESSAGE:
      ind = state.conversations[action.conversationId].messages.findIndex(
        (msg) => msg._id === action.message._id
      );
      state.conversations[action.conversationId].messages.splice(ind, 1);
      state.conversations[action.conversationId].messages = [
        ...state.conversations[action.conversationId].messages,
      ];
      state.conversations[action.conversationId] = {
        ...state.conversations[action.conversationId],
      };
      state.conversations = { ...state.conversations };
      state = { ...state };
      return state;
    case MARK_DELIVERED_ALL:
      state.conversations[action.receiverId].messages.forEach((msg) => {
        if (
          msg.sender !== action.loggedInUserId &&
          msg.readStatus === MessageReadStatus.SENT
        ) {
          msg.readStatus = MessageReadStatus.DELIVERED;
        }
      });
      state.conversations[action.receiverId].messages = [
        ...state.conversations[action.receiverId].messages,
      ];
      state.conversations[action.receiverId] = {
        ...state.conversations[action.receiverId],
      };
      state.conversations = { ...state.conversations };
      state = { ...state };
      return state;
    case UPDATE_STATUS:
      state.conversations[action.user._id].receiver = {
        ...state.conversations[action.user._id].receiver,
        ...action.user,
      };
      state.conversations[action.user._id] = {
        ...state.conversations[action.user._id],
      };
      state.conversations = { ...state.conversations };
      state = { ...state };
      return state;
    case TYPING:
      state.conversations[action.userId].receiver = {
        ...state.conversations[action.userId].receiver,
        isTyping: action.isTyping,
      };
      state.conversations[action.userId] = {
        ...state.conversations[action.userId],
      };
      state.conversations = { ...state.conversations };
      state = { ...state };
      return state;
    case CLEAR_CONVERSATIONS_DATA:
      return {
        ...state,
        activeConversation: "",
        conversations: {},
      };
    default:
      return state;
  }
}
