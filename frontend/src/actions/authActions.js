import { CLEAR_USER, SET_CURRENT_USER } from "./types";
import axios from "../axiosInstance";
import Socket from "../Socket";

export const registerUser = (userdata, history) => (dispatch) => {
  axios
    .post("/user/register", userdata)
    .then((res) => history.push("/"))
    .catch((err) => console.log(err));
};

export const loginUser = (userdata) => (dispatch) => {
  axios
    .post("/user/login", userdata)
    .then((res) => {
      localStorage.setItem("user", JSON.stringify(res.data.user));
      dispatch(setCurrentUser(res.data.user));
    })
    .catch((err) => console.log(err));
};

export const logoutUser = (history) => (dispatch) => {
  axios
    .get("/user/logout")
    .then((res) => {
      dispatch(setCurrentUser({}));
      history.push("/");
      Socket.close();
    })
    .catch((err) => console.log(err));
};

export const clearAuth = () => (dispatch) => {
  dispatch({
    type: CLEAR_USER,
  });
};

export const setCurrentUser = (user) => {
  return {
    type: SET_CURRENT_USER,
    payload: user,
  };
};
