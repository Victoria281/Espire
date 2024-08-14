import axiosInstance from "../config/AxiosInstance";
import { displayErrorHandler } from "../config/ErrorHandler";
import {
    LOGIN,
    REGISTER,
    ADD_VISIT,
    GET_VISIT,
    ADD_UTAGS,
    GET_UTAGS,
    REMOVE_UTAGS,
    GET_SAVE,
    UPDATE_PASSWORD,
    DELETE_USER
} from '../constants/apiUrls'

export const getEspireAPI = async () => {
    try {
        const { data, status } = await axiosInstance.get();
        if (status == 200) return data;
    } catch (e) {
        displayErrorHandler(e, LOGIN);
        return "Backend is not running!"
    }
}
export const loginAPI = async (username, password) => {
    try {
        const { data, status } = await axiosInstance.post(LOGIN, {
            username: username,
            password: password
        });
        if (status == 200) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, LOGIN);
        console.log(e.response)
        const errorMessage = e.response ? e.response.data.error : "refused";
        return { success: false, error: errorMessage };
    }
}

export const registerAPI = async (username, password) => {
    try {
        const result = await axiosInstance.post(REGISTER, {
            username: username,
            password: password
        });
        if (result.status == 200) return { data: result, success: true }
    } catch (e) {
        displayErrorHandler(e, REGISTER);
        const errorMessage = e.response ? e.response.data.error : "refused";
        return { success: false, error: errorMessage };
    }
}

export const saveUserHistoryAPI = async (article_id) => {
    try {
        const { data, status } = await axiosInstance.post(ADD_VISIT, { article_id });
        if (status === 200) return { success: true, data: data };
    } catch (e) {
        displayErrorHandler(e, ADD_VISIT);
        console.log(e.response);
        return { success: false, error: e.response.data };
    }
}

export const getUserVisitsAPI = async () => {
    try {
        const { data, status } = await axiosInstance.get(GET_VISIT);
        if (status === 200) return { success: true, data: data };
    } catch (e) {
        displayErrorHandler(e, GET_VISIT);
        console.log(e.response);
        return { success: false, error: e.response.data };
    }
}

export const addUserTagAPI = async (tag_id) => {
    try {
        const { data, status } = await axiosInstance.post(ADD_UTAGS, { tag_id });
        if (status === 200) return { success: true, data: data };
    } catch (e) {
        displayErrorHandler(e, ADD_UTAGS);
        console.log(e.response);
        return { success: false, error: e.response.data };
    }
}

export const getUserTagsAPI = async () => {
    try {
        const { data, status } = await axiosInstance.get(GET_UTAGS);
        if (status === 200) return { success: true, data: data };
    } catch (e) {
        displayErrorHandler(e, GET_UTAGS);
        console.log(e.response);
        return { success: false, error: e.response.data };
    }
}

export const removeUserTagAPI = async (tag_id) => {
    try {
        const { data, status } = await axiosInstance.delete(REMOVE_UTAGS(tag_id));
        if (status === 200) return { success: true, data: data };
    } catch (e) {
        displayErrorHandler(e, REMOVE_UTAGS(tag_id));
        console.log(e.response);
        return { success: false, error: e.response.data };
    }
}


export const getSavedArticlesAPI = async () => {
    try {
        const { data, status } = await axiosInstance.get(GET_SAVE);
        if (status === 200) return { success: true, data: data };
    } catch (e) {
        displayErrorHandler(e, GET_SAVE);
        console.log(e.response);
        return { success: false, error: e.response.data };
    }
}

export const updatePasswordAPI = async (oldPassword, newPassword) => {
    try {
        const { data, status } = await axiosInstance.put(UPDATE_PASSWORD, {
            old_password: oldPassword,
            new_password: newPassword,
        });
        if (status === 200) return { success: true };
    } catch (e) {
        displayErrorHandler(e, UPDATE_PASSWORD);
        return { success: false, error: e.response.data };
    }
};

export const deleteUserAPI = async () => {
    try {
        const { data, status } = await axiosInstance.delete(DELETE_USER);
        if (status === 200) return { data: data, success: true };
    } catch (e) {
        displayErrorHandler(e, DELETE_USER);
        console.log(e.response);
        const errorMessage = e.response ? e.response.data.error : "refused";
        return { success: false, error: errorMessage };
    }
};