import axiosInstance from "../config/AxiosInstance";
import { displayErrorHandler } from "../config/ErrorHandler";
import {
    GET_OWN_ARTICLES,
    GET_ARTICLES_BY_ID,
    // GET_ARTICLES_BY_USER,
    // GET_ARTICLES_BY_NAME,
    CREATE_NEW_ARTICLE,
    CREATE_NEW_ARTICLE_LINK,
    CREATE_NEW_ARTICLE_QUOTE,
    // UPDATE_ARTICLE,
    // DELETE_ARTICLE,
    UPDATE_ARTICLE,
    UPDATE_ARTICLE_LINK,
    UPDATE_ARTICLE_QUOTE,
    SEARCH_ARTICLES,
    GET_ALL_TAGS

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

export const getArticlesByIdAPI = async (id) => {
    try {
        const { data, status } = await axiosInstance.get(GET_ARTICLES_BY_ID(id));
        if (status == 200) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, GET_OWN_ARTICLES);
        return { success: false }
    }
}

export const createNewArticleAPI = async (new_info) => {
    try {
        const { data, status } = await axiosInstance.post(CREATE_NEW_ARTICLE, new_info);
        if (status == 201) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, CREATE_NEW_ARTICLE);
        return { success: false, error: e.response.data }
    }
}

export const createNewArticleLinkAPI = async (new_info) => {
    try {
        const { data, status } = await axiosInstance.post(CREATE_NEW_ARTICLE_LINK, new_info);
        if (status == 201) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, CREATE_NEW_ARTICLE_LINK);
        return { success: false, error: e.response.data }
    }
}

export const createNewArticleQuotesAPI = async (new_info) => {
    try {
        const { data, status } = await axiosInstance.post(CREATE_NEW_ARTICLE_QUOTE, new_info);
        if (status == 201) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, CREATE_NEW_ARTICLE_QUOTE);
        return { success: false, error: e.response.data }
    }
}

export const updateArticleAPI = async (id, new_info) => {
    try {
        const { data, status } = await axiosInstance.put(UPDATE_ARTICLE(id), new_info);
        if (status == 201) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, UPDATE_ARTICLE(id));
        return { success: false, error: e.response.data }
    }
}

export const updateArticleLinkAPI = async (new_info) => {
    try {
        const { data, status } = await axiosInstance.put(UPDATE_ARTICLE_LINK(new_info.article_id), new_info);
        if (status == 201) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, UPDATE_ARTICLE_LINK(new_info.article_id));
        return { success: false, error: e.response.data }
    }
}

export const updateArticleQuotesAPI = async (new_info) => {
    try {
        const { data, status } = await axiosInstance.put(UPDATE_ARTICLE_QUOTE(new_info.article_id), new_info);
        if (status == 201) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, UPDATE_ARTICLE_QUOTE(new_info.article_id));
        return { success: false, error: e.response.data }
    }
}

export const searchArticleAPI = async (query) => {
    try {
        const { data, status } = await axiosInstance.get(SEARCH_ARTICLES, { params: { query } });
        if (status == 200) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, SEARCH_ARTICLES);
        return { success: false, error: e.response.data }
    }
}


export const getAllTagsAPI = async () => {
    try {
        const { data, status } = await axiosInstance.get(GET_ALL_TAGS);
        if (status == 200) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, GET_ALL_TAGS);
        return { success: false, error: e.response.data }
    }
}

