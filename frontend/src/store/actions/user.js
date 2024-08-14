import {
  loginAPI, registerAPI
} from "../../controller/userController"

export const SET_USER_INFO = 'SET_USER_INFO';
export const CLEAR_STATE = 'CLEAR_STATE';


export const handleLoginUser = (username, password) => async (dispatch) => {
  const result = await loginAPI(username, password);
  if (!result.success) return { success: false, error: result.error };
  dispatch({
    type: SET_USER_INFO,
    username: username,
    token: result.data.token
  });
  return { success: result.success }
};

export const handleRegisterUser = (username, password) => async (dispatch) => {
  const result = await registerAPI(username, password);
  if (!result.success) return { success: false, error: result.error };
  return dispatch(handleLoginUser(username, password));
};

export const clear_store = () => async (dispatch) => {
  dispatch({
    type: CLEAR_STATE
  });
};

