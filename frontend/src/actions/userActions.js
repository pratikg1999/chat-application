import Socket from "../Socket";
import SocketEvents from "../utils/SocketEvents";
import { GET_USERS, CLEAR_USERS_DATA } from "./types";

export const getAllUsers = () => (dispatch, getState) => {
  Socket.emit(SocketEvents.GET_USERS, (response) => {
    dispatch({ type: GET_USERS, users: response.users });
  });
};

export const clearUsers = () => (dispatch) => {
  dispatch({
    type: CLEAR_USERS_DATA,
  });
};
