import axiosInstance from "../config/AxiosInstance";
import { displayErrorHandler } from "../config/ErrorHandler";
import {
    LOGIN,
    REGISTER,
} from '../constants/apiUrls'

export const loginAPI = async (username, password) => {
    try {
        const { data, status } = await axiosInstance.post(LOGIN, {
            username: username,
            password: password
        });
        if (status == 200) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, LOGIN);
        return { success: false, error: e.response.data }
    }
}

export const registerAPI = async (username, email, password) => {
    try {
        const result = await axiosInstance.post(REGISTER, {
            username: username,
            email: email,
            password: password
        });
        if (result.status == 200) return { data: result, success: true }
    } catch (e) {
        displayErrorHandler(e, REGISTER);
        return { success: false }
    }
}