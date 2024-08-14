import { clear_store } from '../store/actions/user';

export const logout = (dispatch, navigate) => {
    dispatch(clear_store());
    navigate("/login");
    window.alert('Please login again');
}
