import axiosInstance from "../config/AxiosInstance";
import { displayErrorHandler } from "../config/ErrorHandler";
import {
    LOGIN,
    REGISTER,
} from '../constants/apiUrls'

export const loginAPI = async (username, password) => {
    try {
        const { data, status } = await axiosInstance.post(LOGIN, {
            data: {
                username: username,
                password: password
            }
        });
        if (status == 200) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, GET_VERSION_INFO(versionid));
        return { success: false }
    }
}

export const registerAPI = async (username, email, password) => {
    try {
        const { data, status } = await axiosInstance.post(REGISTER, {
            data: {
                username: username,
                email: email,
                password: password
            }
        });
        if (status == 200) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, GET_VERSION_INFO(versionid));
        return { success: false }
    }
}