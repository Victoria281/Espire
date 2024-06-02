import {
  SET_USER_INFO
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
    default:
      return state;
  }
};

export default reducer;
