import { CLEAR_USERS_DATA, GET_USERS } from "../actions/types";

const initialState = {
  users: [],
};

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return { users: action.users };
    case CLEAR_USERS_DATA:
      return { users: [] };
    default:
      return state;
  }
}
