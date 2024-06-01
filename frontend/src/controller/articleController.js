import axiosInstance from "../config/AxiosInstance";
import { displayErrorHandler } from "../config/ErrorHandler";
import {
    GET_ARTICLES_BY_OWNID,
    GET_ARTICLES_BY_USER,
    GET_ARTICLES_BY_NAME,
    GET_ARTICLES_BY_ID,
    CREATE_NEW_ARTICLE,
    UPDATE_ARTICLE,
    DELETE_ARTICLE
} from '../constants/apiUrls'

export const getMyArticlesAPI = async () => {
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