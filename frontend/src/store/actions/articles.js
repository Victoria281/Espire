import {
    getMyArticlesAPI,
    getArticlesByIdAPI,
    createNewArticleAPI,
    createNewArticleLinkAPI,
    createNewArticleQuotesAPI,
    updateArticleAPI,
    updateArticleLinkAPI,
    updateArticleQuotesAPI,
    searchArticleAPI,
    getAllTagsAPI,
    scrapeArticleAPI,
    createNewTagAPI,
    createNewArticleTagsAPI,
    searchGoogleArticleAPI
} from '../../controller/articleController';
import {
    ARTICLE_BASE_TEMPLATE,
    ARTICLE_BASE_TEMPLATE_FILLED
} from "../../constants/names";

export const SET_ARTICLES = 'SET_ARTICLES';
export const SET_ARTICLE_WORKSPACE = 'SET_ARTICLE_WORKSPACE';
export const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS';
export const SET_TAGS = 'SET_TAGS';

export const getMyArticles = () => async (dispatch) => {
    const result = await getMyArticlesAPI();
    if (!result.success) return null;
    dispatch({
        type: SET_ARTICLES,
        articles: result.data
    });
    return result;
};

export const getArticlesById = (id) => async (dispatch) => {
    const result = await getArticlesByIdAPI(id);
    if (!result.success) return null;
    dispatch({
        type: SET_ARTICLE_WORKSPACE,
        workspace: {
            article: result.data,
            collectionId: null
        }
    });
    return result;
};

export const newArticleWorkspace = () => async (dispatch) => {
    dispatch({
        type: SET_ARTICLE_WORKSPACE,
        workspace: {
            article: ARTICLE_BASE_TEMPLATE,
            collectionId: null
        }
    });
};

export const handleCreateNewArticlePost = (new_info) => async (dispatch, getState) => {
    let articleid = -1;

    const tags = getState().articles.tags;
    const existingTagNames = tags.map(tag => tag.name);
    const oldTagIds = tags
        .filter(tag => new_info.Tags.some(newTag => newTag.name === tag.name))
        .map(tag => tag.ID);

    const newTags = new_info.Tags.filter(tag => !existingTagNames.includes(tag.name));
    const newTagIds = [];
    for (const tag of newTags) {
        const result = await createNewTagAPI({ name: tag.name });
        if (result.success) {
            newTagIds.push(result.data.id);
        }
    }
    const allTagIds = [...oldTagIds, ...newTagIds];

    const result = await createNewArticleAPI({
        name: new_info.name,
        authors: new_info.authors,
        use: new_info.use,
        description: new_info.description
    })
    if (result.success) {
        articleid = result.data.id;
        await createNewArticleLinkAPI({ article_id: articleid.toString(), Links: new_info.Links });
        await createNewArticleQuotesAPI({ article_id: articleid.toString(), Quotes: new_info.Quotes });
        await createNewArticleTagsAPI({ article_id: articleid.toString(), Tags: allTagIds });
    }
    return articleid;
    return null
}

export const handleUpdateNewArticlePost = (new_info) => async (dispatch, getState) => {
    console.log(new_info);
    await updateArticleAPI(new_info.id, {
        name: new_info.name,
        authors: new_info.authors,
        use: new_info.use,
        description: new_info.description
    })
    await updateArticleLinkAPI({ article_id: new_info.id.toString(), Links: new_info.Links });
    await updateArticleQuotesAPI({ article_id: new_info.id.toString(), Quotes: new_info.Quotes });
    return true;
}

export const searchArticles = (query) => async (dispatch, getState) => {
    console.log(query)
    const result = await searchArticleAPI(query);

    let msg = ''

    if (result.data.web == null) {
        msg = "Blocked by Google Scholar. Fallback to Google API..."

        console.log(msg)
        dispatch({
            type: SET_SEARCH_RESULTS,
            search: result.data,
            searchloader: msg
        });
        return dispatch(searchGoogleArticles(query))
    }
    return result;
}

export const searchGoogleArticles = (query) => async (dispatch, getState) => {
    console.log("searchGoogleArticles")
    const result = await searchGoogleArticleAPI(query);
    const state = getState().articles;
    console.log(result)
    dispatch({
        type: SET_SEARCH_RESULTS,
        search: {
            ...state.search,
            web: result.data.web
        },
        searchloader: ''
    });
    return result;
}

export const getAllTags = () => async (dispatch, getState) => {
    const result = await getAllTagsAPI();
    dispatch({
        type: SET_TAGS,
        tags: result.data
    });
    return result;
}


export const scrapeArticle = (link) => async (dispatch, getState) => {
    const result = await scrapeArticleAPI(link);
    return result;
}




// export const getArticlesByUser = (user) => async (dispatch) => {
//   const result = await getArticlesByUserAPI(user);
//   if (!result.success) return null;
//   console.log(result)
//   return result;
// };

// export const getArticlesByName = (articlename) => async (dispatch) => {
//   const result = await getArticlesByNameAPI(articlename);
//   if (!result.success) return null;
//   console.log(result)
//   return result;
// };


// export const createNewArticle = (articleInfo) => async (dispatch) => {
//   const result = await createNewArticleAPI(articleInfo);
//   if (!result.success) return null;
//   console.log(result)
//   return result;
// };

// export const updateArticleInfo = (articleInfo) => async (dispatch) => {
//   const result = await updateArticleInfoAPI(articleInfo);
//   if (!result.success) return null;
//   console.log(result)
//   return result;
// };

// export const deleteArticle = (id) => async (dispatch) => {
//   const result = await deleteArticleAPI(id);
//   if (!result.success) return null;
//   console.log(result)
//   return result;
// };