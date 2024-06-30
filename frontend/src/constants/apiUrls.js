
export const LOGIN = "/auth/login";
export const REGISTER = "/auth/register";

export const GET_OWN_ARTICLES = "/articles";
export const GET_ARTICLES_BY_ID = (aid) => `/articles/id/${aid}`;

export const GET_ARTICLES_BY_USER = (aid) => `/articles/${aid}`;
export const GET_ARTICLES_BY_NAME = (aid) => `/articles/${aid}`;
export const CREATE_NEW_ARTICLE =  `/articles/create`;
export const CREATE_NEW_ARTICLE_LINK = `/articles/links`;
export const CREATE_NEW_ARTICLE_QUOTE = `/articles/quotes`;

export const UPDATE_ARTICLE = (aid) => `/articles/${aid}`;
export const UPDATE_ARTICLE_LINK = (aid) => `/articles/links/${aid}`;
export const UPDATE_ARTICLE_QUOTE = (aid) => `/articles/quotes/${aid}`;

export const DELETE_ARTICLE = (aid) => `/articles/${aid}`;


export const SEARCH_ARTICLES = `/articles/search`;
export const GET_ALL_TAGS = `/tags`;
export const GET_WEB_SCRAPE = `/articles/webscrap`;
export const CREATE_NEW_TAG = `/tags`;
export const ATTACH_TAGS = (aid) => `/tags/articles/${aid}`;