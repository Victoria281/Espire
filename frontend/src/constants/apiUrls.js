
export const LOGIN = "/auth/login";
export const REGISTER = "/auth/register";

export const GET_OWN_ARTICLES = "/articles";
export const GET_OWN_COLLECTIONS = "/collections";

export const GET_ARTICLES_BY_ID = (aid) => `/articles/id/${aid}`;

export const GET_ARTICLES_BY_USER = (aid) => `/articles/${aid}`;
export const GET_ARTICLES_BY_NAME = (aid) => `/articles/${aid}`;
export const CREATE_NEW_ARTICLE =  `/articles/create`;
export const CREATE_NEW_ARTICLE_LINK = `/articles/links`;
export const CREATE_NEW_ARTICLE_QUOTE = `/articles/quotes`;

export const UPDATE_ARTICLE = (aid) => `/articles/${aid}`;
export const UPDATE_ARTICLE_LINK = (aid) => `/articles/links/${aid}`;
export const UPDATE_ARTICLE_QUOTE = (aid) => `/articles/quotes/${aid}`;
export const DELETE_ARTICLE_QUOTE = (aid) => `/articles/quotes/${aid}`;

export const UPDATE_FLASHCARDS = (aid) => `/articles/flashcards/${aid}`;
export const DELETE_FLASHCARDS = (aid) => `/articles/flashcards/${aid}`;
export const GENERATE_FLASHCARDS = (aid) => `/articles/flashcards/generate/${aid}`;

export const DELETE_ARTICLE = (aid) => `/articles/${aid}`;


export const SEARCH_ARTICLES = `/articles/search`;
export const SEARCH_GOOGLE_ARTICLES = `/articles/googlesearch`;
export const GET_ALL_TAGS = `/tags`;
export const GET_WEB_SCRAPE = `/articles/webscrap`;
export const CREATE_NEW_TAG = `/tags`;
export const ATTACH_TAGS = (aid) => `/tags/articles/${aid}`;


export const CREATE_COLLECTION =  `/collections`;
export const DELETE_COLLECTION = (aid) => `/collections/${aid}`;
export const ARTICLE_TO_COLLECTION = (aid, cid) => `/collections/${cid}/articles/${aid}`;
export const ARTICLE_FROM_COLLECTION = (aid, cid) => `/collections/${cid}/articles/${aid}`;
export const SAVE_SYNTHESIS = `/collections/synthesis`;

export const SEARCH_USER = (cid) => `/collections/${cid}/users/search`;
export const GET_INVITED = (cid) => `/collections/${cid}/users`;
export const INVITE = (cid) => `/collections/${cid}/users/invite`;
export const GET_SHARED_COLLECTIONS = `/collections/shared`;
export const UPDATE_PASSWORD = `/users/update`;
export const DELETE_USER = `/users/delete`;


export const GET_RECCS = `/users/get-reccomendations`;
export const ADD_VISIT = `/users/add-visit`;
export const GET_VISIT = `/users/get-visits`;
export const ADD_UTAGS = `/users/add-tag`;
export const GET_UTAGS = `/users/get-tags`;
export const REMOVE_UTAGS = (tag_id) =>  `/users/remove-tag/${tag_id}`;
export const SAVE_ARTICLE = (id) => `/users/save/${id}`;
export const GET_SAVE = `/users/save`;