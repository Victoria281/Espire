import {
    getMyArticlesAPI,
    getArticlesByIdAPI,
    createNewArticleAPI,
    createNewArticleLinkAPI,
    createNewArticleQuotesAPI,
    updateArticleAPI,
    updateArticleLinkAPI,
    updateArticleQuotesAPI
} from '../../controller/articleController';
import {
    ARTICLE_BASE_TEMPLATE,
    ARTICLE_BASE_TEMPLATE_FILLED
} from "../../constants/names";

export const SET_ARTICLES = 'SET_ARTICLES';
export const SET_ARTICLE_WORKSPACE = 'SET_ARTICLE_WORKSPACE';

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

export const handleCreateNewArticlePost = (new_info) => {
    return async (dispatch, getState) => {
        let articleid = -1;
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
        }
        return articleid;
    }
}

export const handleUpdateNewArticlePost = (new_info) => {
    return async (dispatch, getState) => {
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