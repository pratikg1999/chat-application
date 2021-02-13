import Socket from "../Socket";
import MessageReadStatus from "../utils/MessageReadStatus";
import SocketEvents from "../utils/SocketEvents";
import { findConversationId, formatMessageForServer } from "../utils/utils";
import {
  ADD_MESSAGE,
  TYPING,
  EDIT_MESSAGE,
  UPDATE_STATUS,
  MARK_DELIVERED_ALL,
  ADD_NEW_CONVERSATION,
  GET_CONVERSATIONS,
  SET_CURRENT_USER,
} from "./types";

export const setUpSocket = (connnectionUrl) => (dispatch, getState) => {
  const { user } = getState().auth;
  Socket.connect(connnectionUrl, user._id);
  setUpListeners(dispatch, getState);
};

export const setUpListeners = (dispatch, getState) => {
  Socket.on(SocketEvents.CONNECT, () => {
    const currentState = getState();
    const { user: loggedInUser } = currentState.auth;
    Socket.emit(SocketEvents.STATUS_UPDATE);
    Socket.emit(SocketEvents.GET_CONVERSATIONS, (response) => {
      const loggedInUserId = loggedInUser._id;
      dispatch({
        type: GET_CONVERSATIONS,
        conversations: response.conversations,
        loggedInUserId,
      });
      Socket.emit(SocketEvents.DELIVERED_ALL);
    });
    Socket.emit(SocketEvents.GET_USER, (response) => {
      dispatch({
        type: SET_CURRENT_USER,
        payload: response.user,
      });
    });
  });

  Socket.on(SocketEvents.STATUS_UPDATE, (response) => {
    dispatch({ type: UPDATE_STATUS, user: response.user });
  });

  Socket.on(SocketEvents.CONNECTION_ADDED, () => {
    Socket.emit(SocketEvents.GET_CONVERSATIONS, (response) => {
      const currentState = getState();
      const { user: loggedInUser } = currentState.auth;
      const loggedInUserId = loggedInUser._id;
      dispatch({
        type: GET_CONVERSATIONS,
        conversations: response.conversations,
        loggedInUserId,
      });
    });
    Socket.emit(SocketEvents.GET_USER, (response) => {
      dispatch({
        type: SET_CURRENT_USER,
        payload: response.user,
      });
    });
  });

  Socket.on(SocketEvents.MESSAGE_ADDED, (message) => {
    const currentState = getState();
    const { activeConversation } = currentState.conversationsData;
    const { user: loggedInUser } = currentState.auth;
    const conversationId = findConversationId(message, loggedInUser._id);
    if (activeConversation === conversationId) {
      message.readStatus = MessageReadStatus.SEEN;
    } else {
      message.readStatus = MessageReadStatus.DELIVERED;
    }
    Socket.emit(
      SocketEvents.EDIT_MESSAGE,
      formatMessageForServer(message),
      (response) => {
        dispatch({
          type: ADD_MESSAGE,
          message: response.message,
          conversationId: conversationId,
        });
      }
    );
  });

  Socket.on(SocketEvents.EDIT_MESSAGE, (message) => {
    const loggedInUserId = getState().auth.user._id;
    const conversationId = findConversationId(message, loggedInUserId);
    const conversations = getState().conversationsData.conversations;
    if (!conversations[conversationId]) {
      const receiver = getState().usersData.users.find(
        (user) => user._id == conversationId
      );
      dispatch({ type: ADD_NEW_CONVERSATION, receiver: receiver });
    }
    dispatch({ type: EDIT_MESSAGE, message: message, conversationId });
  });

  Socket.on(SocketEvents.DELIVERED_ALL, (receiverId) => {
    const loggedInUserId = getState().auth.user._id;
    dispatch({
      type: MARK_DELIVERED_ALL,
      receiverId: receiverId,
      loggedInUserId,
    });
  });

  const typingTimers = {}; //key-value pair (userid: timer)
  const TYPING_TH = 2000;
  Socket.on(SocketEvents.TYPING, (userId) => {
    dispatch({ type: TYPING, userId: userId, isTyping: true });
    if (typingTimers[userId]) {
      clearTimeout(typingTimers[userId]);
      typingTimers[userId] = null;
    }
    typingTimers[userId] = setTimeout(() => {
      dispatch({ type: TYPING, userId: userId, isTyping: false });
    }, TYPING_TH);
  });
};

export const sendTyping = (receiverId) => (dispatch, getState) => {
  Socket.emit(SocketEvents.TYPING, receiverId);
};
