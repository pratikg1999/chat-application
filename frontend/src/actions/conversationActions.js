import {
  SET_ACTIVE_CONVERSATION,
  ADD_MESSAGE,
  EDIT_MESSAGE,
  GET_CONVERSATIONS,
  ADD_NEW_CONVERSATION,
  SET_CURRENT_USER,
  CLEAR_CONVERSATIONS_DATA,
} from "./types";
import Socket from "../Socket";
import { v4 as uuidv4 } from "uuid";
import SocketEvents from "../utils/SocketEvents";
import { findConversationId, formatMessageForServer } from "../utils/utils";
import axios from "../axiosInstance";

export const setActiveConversation = (receiver) => async (
  dispatch,
  getState
) => {
  const { conversations } = getState().conversationsData;
  if (!conversations[receiver._id]) {
    dispatch({ type: ADD_NEW_CONVERSATION, receiver: receiver });
    Socket.emit(SocketEvents.ADD_CONNECTION, receiver, (response) => {
      dispatch({ type: SET_CURRENT_USER, payload: response.user });
    });
  }
  dispatch({ type: SET_ACTIVE_CONVERSATION, receiver: receiver });
};

export const sendMessage = (message) => (dispatch, getState) => {
  const localId = uuidv4();
  message.localId = localId;
  const loggedInUserId = getState().auth.user._id;
  const conversationId = findConversationId(message, loggedInUserId);
  dispatch({
    type: ADD_MESSAGE,
    message: message,
    conversationId: conversationId,
  });
  Socket.emit(
    SocketEvents.SEND_MESSAGE,
    formatMessageForServer(message),
    (response) => {
      dispatch({
        type: EDIT_MESSAGE,
        message: response.message,
        localId: localId,
        conversationId: conversationId,
      });
    }
  );
};

export const editMessage = (message) => (dispatch, getState) => {
  Socket.emit(
    SocketEvents.EDIT_MESSAGE,
    formatMessageForServer(message),
    (response) => {
      const loggedInUserId = getState().auth.user._id;
      const conversationId = findConversationId(message, loggedInUserId);
      dispatch({
        type: EDIT_MESSAGE,
        message: response.message,
        conversationId,
      });
    }
  );
};

export const deleteMessage = (message) => (dispatch, getState) => {
  editMessage(message)(dispatch, getState);
};

export const getConversations = () => (dispatch, getState) => {
  Socket.emit(SocketEvents.GET_CONVERSATIONS, (conversations) => {
    const loggedInUserId = getState().auth.user._id;
    dispatch({
      type: GET_CONVERSATIONS,
      conversations: conversations,
      loggedInUserId,
    });
  });
};

export const updateMyStatus = (user) => (dispatch) => {
  dispatch({ type: SET_CURRENT_USER, payload: user });
};

export const uploadAttachment = (attachment) => async (dispatch, getState) => {
  let form = new FormData();
  form.append("attachment", attachment);

  try {
    const { data } = await axios.post("/uploadAttachment", form);
    return data.url;
  } catch (err) {
    console.log("failed to upload file");
    return "";
  }
};

export const clearConversations = () => (dispatch) => {
  dispatch({
    type: CLEAR_CONVERSATIONS_DATA,
  });
};
