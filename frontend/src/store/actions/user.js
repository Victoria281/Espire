export const SET_USER_INFO = 'SET_USER_INFO';


export const handleLoginUser = (username, password) => async (dispatch) => {
  const result = await loginAPI(username, password);
  if (!result.success) return null;
  console.log(result)
  dispatch({
    type: SET_USER_INFO,
    result: result.data
  });
};
//return token -> save it
//set onboarding to true

export const handleRegisterUser = (username, email, password) => async (dispatch) => {
  const result = await registerAPI(username, email, password);
  if (!result.success) return null;
  console.log(result)
  const retrieveToken = await loginAPI(username, email, password);
  if (!retrieveToken.success) return null;
  console.log(retrieveToken)
  dispatch({
    type: SET_USER_INFO,
    result: result.data
  });
  //set onboarding to false
  //update user token
};