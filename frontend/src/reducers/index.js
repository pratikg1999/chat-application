import { combineReducers } from "redux";
import authReducer from "./authReducer";
import conversationReducer from "./conversationReducer";
import usersReducer from "./usersReducer";
export default combineReducers({
  auth: authReducer,
  conversationsData: conversationReducer,
  usersData: usersReducer,
});
