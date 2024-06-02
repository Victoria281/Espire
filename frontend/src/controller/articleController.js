import axiosInstance from "../config/AxiosInstance";
import { displayErrorHandler } from "../config/ErrorHandler";
import {
    GET_OWN_ARTICLES,
    // GET_ARTICLES_BY_USER,
    // GET_ARTICLES_BY_NAME,
    // GET_ARTICLES_BY_ID,
    // CREATE_NEW_ARTICLE,
    // UPDATE_ARTICLE,
    // DELETE_ARTICLE
} from '../constants/apiUrls'

export const getMyArticlesAPI = async () => {
    try {
        const { data, status } = await axiosInstance.get(GET_OWN_ARTICLES);
        if (status == 200) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, GET_OWN_ARTICLES);
        return { success: false }
    }
}