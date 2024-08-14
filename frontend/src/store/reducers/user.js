import {
  SET_USER_INFO,
  CLEAR_STATE
} from '../actions/user';

const initialState = {
  username: "",
  token: undefined,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        username: action.username,
        token: action.token,
      };
    case CLEAR_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
