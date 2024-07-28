import axiosInstance from "../config/AxiosInstance";
import { displayErrorHandler } from "../config/ErrorHandler";
import {
    GET_OWN_ARTICLES,
    GET_OWN_COLLECTIONS,
    GET_ARTICLES_BY_ID,
    // GET_ARTICLES_BY_USER,
    // GET_ARTICLES_BY_NAME,
    CREATE_NEW_ARTICLE,
    DELETE_ARTICLE,
    CREATE_NEW_ARTICLE_LINK,
    CREATE_NEW_ARTICLE_QUOTE,
    // UPDATE_ARTICLE,
    GET_RECCS,
    UPDATE_ARTICLE,
    UPDATE_ARTICLE_LINK,
    UPDATE_ARTICLE_QUOTE,
    DELETE_ARTICLE_QUOTE,
    SEARCH_ARTICLES,
    SEARCH_GOOGLE_ARTICLES,
    GET_ALL_TAGS,
    GET_WEB_SCRAPE,
    CREATE_NEW_TAG,
    ATTACH_TAGS,
    UPDATE_FLASHCARDS,
    DELETE_FLASHCARDS,
    CREATE_COLLECTION,
    DELETE_COLLECTION,
    ARTICLE_TO_COLLECTION,
    ARTICLE_FROM_COLLECTION,
    SAVE_SYNTHESIS,
    SEARCH_USER,
    GET_INVITED,
    INVITE,
    GET_SHARED_COLLECTIONS,
    SAVE_ARTICLE,
    GET_SAVE,
    GENERATE_FLASHCARDS
} from '../constants/apiUrls'

export const getMyArticlesAPI = async () => {
    try {
        const { data, status } = await axiosInstance.get(GET_OWN_ARTICLES);
        if (status == 200) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, GET_OWN_ARTICLES);
        console.log(e)
        return { success: false }
    }
}

export const getMyCollectionsAPI = async () => {
    try {
        const { data, status } = await axiosInstance.get(GET_OWN_COLLECTIONS);
        if (status == 200) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, GET_OWN_COLLECTIONS);
        return { success: false }
    }
}

export const getMySharedCollectionsAPI = async () => {
    try {
        const { data, status } = await axiosInstance.get(GET_SHARED_COLLECTIONS);
        if (status == 200) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, GET_SHARED_COLLECTIONS);
        return { success: false }
    }
}

export const getArticlesByIdAPI = async (id) => {
    try {
        const { data, status } = await axiosInstance.get(GET_ARTICLES_BY_ID(id));
        if (status == 200) {
            const article = data.article;
            article.owner = data.isOwner;
            article.save = data.isSaved;
            return { data: article, success: true }
        }
    } catch (e) {
        displayErrorHandler(e, GET_OWN_ARTICLES);
        return { success: false }
    }
}

export const deleteArticlesByIdAPI = async (id) => {
    try {
        const { data, status } = await axiosInstance.delete(DELETE_ARTICLE(id));
        if (status === 200) return { data: data, success: true };
    } catch (e) {
        displayErrorHandler(e, DELETE_ARTICLE(id));
        return { success: false, error: e.response.data }
    }
};

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
    console.log("updateArticleQuotesAPI")
    console.log(new_info)
    try {
        const { data, status } = await axiosInstance.put(UPDATE_ARTICLE_QUOTE(new_info.article_id), new_info);
        if (status == 201) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, UPDATE_ARTICLE_QUOTE(new_info.article_id));
        return { success: false, error: e.response.data }
    }
}

export const deleteArticleQuotesAPI = async (id) => {
    try {
        const { data, status } = await axiosInstance.delete(DELETE_ARTICLE_QUOTE(id));
        if (status == 201) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, DELETE_ARTICLE_QUOTE(id));
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

export const searchGoogleArticleAPI = async (query) => {
    try {
        const { data, status } = await axiosInstance.get(SEARCH_GOOGLE_ARTICLES, { params: { query } });
        if (status == 200) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, SEARCH_GOOGLE_ARTICLES);
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

export const scrapeArticleAPI = async (url) => {
    try {
        const { data, status } = await axiosInstance.get(GET_WEB_SCRAPE, { params: { url } });
        if (status == 200) return { data: data, success: true }
    } catch (e) {
        console.log(e.response.data)
        displayErrorHandler(e, GET_WEB_SCRAPE);
        return { success: false, error: e.response.data }
    }
}



export const createNewTagAPI = async (name) => {
    try {
        const { data, status } = await axiosInstance.post(CREATE_NEW_TAG, name);
        if (status == 201 || status == 200) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, CREATE_NEW_TAG);
        return { success: false, error: e.response.data }
    }
}

export const createNewArticleTagsAPI = async (new_info) => {
    try {
        const { data, status } = await axiosInstance.put(ATTACH_TAGS(new_info.article_id), { tagids: new_info.Tags });
        if (status == 201) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, ATTACH_TAGS(new_info.article_id));
        return { success: false, error: e.response.data }
    }
}

export const generateFlashcardsAPI = async (id) => {
    try {
        const { data, status } = await axiosInstance.post(GENERATE_FLASHCARDS(id));
        if (status == 200) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, GENERATE_FLASHCARDS(id));
        console.log(e.response)
        return { success: false, error: e.response.data }
    }
}

export const updateFlashcardsAPI = async (new_info, id) => {
    try {
        const { status } = await axiosInstance.put(UPDATE_FLASHCARDS(id), { data: new_info });
        if (status == 200) return { success: true }
    } catch (e) {
        displayErrorHandler(e, UPDATE_FLASHCARDS(id));
        console.log(e.response)
        return { success: false, error: e.response.data }
    }
}

export const deleteFlashcardsAPI = async (id) => {
    try {
        const { status } = await axiosInstance.delete(DELETE_FLASHCARDS(id));
        if (status == 200) return { success: true }
    } catch (e) {
        displayErrorHandler(e, DELETE_FLASHCARDS(id));
        console.log(e.response)
        return { success: false, error: e.response.data }
    }
}

export const createCollectionAPI = async (name) => {
    try {
        const { data, status } = await axiosInstance.post(CREATE_COLLECTION, { name: name });
        if (status == 201) return { data: data, success: true }
    } catch (e) {
        displayErrorHandler(e, CREATE_COLLECTION);
        console.log(e.response)
        return { success: false, error: e.response.data }
    }
}

export const deleteCollectionAPI = async (id) => {
    try {
        const { status } = await axiosInstance.delete(DELETE_COLLECTION(id));
        if (status == 200) return { success: true }
    } catch (e) {
        displayErrorHandler(e, DELETE_COLLECTION(id));
        console.log(e.response)
        return { success: false, error: e.response.data }
    }
}

export const assignArticleToCollectionAPI = async (articleid, collectionid) => {
    try {
        const { status } = await axiosInstance.post(ARTICLE_TO_COLLECTION(articleid, collectionid));
        if (status == 200) return { success: true }
    } catch (e) {
        displayErrorHandler(e, ARTICLE_TO_COLLECTION(articleid, collectionid));
        console.log(e.response)
        return { success: false, error: e.response.data }
    }
}

export const removeArticleFromCollectionAPI = async (articleid, collectionid) => {
    try {
        const { status } = await axiosInstance.delete(ARTICLE_FROM_COLLECTION(articleid, collectionid));
        if (status == 200) return { success: true }
    } catch (e) {
        displayErrorHandler(e, ARTICLE_FROM_COLLECTION(articleid, collectionid));
        console.log(e.response)
        return { success: false, error: e.response.data }
    }
}

export const saveSynthesisAPI = async (info) => {
    try {
        const { status } = await axiosInstance.post(SAVE_SYNTHESIS, info);
        if (status == 200) return { success: true }
    } catch (e) {
        displayErrorHandler(e, SAVE_SYNTHESIS);
        console.log(e.response)
        return { success: false, error: e.response.data }
    }
}

export const searchUserAPI = async (collectionID, query) => {
    try {
        const { data, status } = await axiosInstance.get(SEARCH_USER(collectionID), { params: { query } });
        if (status === 200) return { success: true, users: data };
    } catch (e) {
        displayErrorHandler(e, SEARCH_USER(collectionID));
        console.log(e.response);
        return { success: false, error: e.response.data };
    }
}

export const removeUserAPI = async (collectionID, username) => {
    try {
        const { status } = await axiosInstance.delete(INVITE(collectionID), { data: { username } });
        if (status === 200) return { success: true };
    } catch (e) {
        displayErrorHandler(e, INVITE(collectionID));
        console.log(e.response);
        return { success: false, error: e.response.data };
    }
}

export const inviteUserAPI = async (collectionID, username) => {
    try {
        const { status } = await axiosInstance.post(INVITE(collectionID), { username });
        if (status === 200) return { success: true };
    } catch (e) {
        displayErrorHandler(e, INVITE(collectionID));
        console.log(e.response);
        return { success: false, error: e.response.data };
    }
}

export const getInvitedUsersAPI = async (collectionID) => {
    try {
        const { data, status } = await axiosInstance.get(GET_INVITED(collectionID));
        if (status === 200) return { success: true, users: data };
    } catch (e) {
        displayErrorHandler(e, GET_INVITED(collectionID));
        console.log(e.response);
        return { success: false, error: e.response.data };
    }
}

export const getReccomendationsAPI = async (collectionID) => {
    try {
        const { data, status } = await axiosInstance.get(GET_RECCS);
        if (status === 200) return { success: true, data: data };
    } catch (e) {
        displayErrorHandler(e, GET_RECCS);
        console.log(e.response);
        return { success: false, error: e.response.data };
    }
}


export const saveArticleAPI = async (id) => {
    try {
        const { data, status } = await axiosInstance.post(SAVE_ARTICLE(id));
        if (status === 200) return { success: true, data: data };
    } catch (e) {
        displayErrorHandler(e, SAVE_ARTICLE(id));
        console.log(e.response);
        return { success: false, error: e.response.data };
    }
}


export const getSavedArticleAPI = async () => {
    try {
        const { data, status } = await axiosInstance.get(GET_SAVE);
        if (status === 200) return { success: true, data: data };
    } catch (e) {
        displayErrorHandler(e, GET_SAVE);
        console.log(e.response);
        return { success: false, error: e.response.data };
    }
}
