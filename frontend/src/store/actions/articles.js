import {
  getMyArticlesAPI,
  getArticlesByUserAPI,
  getArticlesByNameAPI,
  getArticlesByIdAPI,
  createNewArticleAPI,
  updateArticleInfoAPI,
  deleteArticleAPI
} from '../../controller/articleController';

export const SET_ARTICLES = 'SET_ARTICLES';

export const getMyArticles = () => async (dispatch) => {
  const result = await getMyArticlesAPI();
  if (!result.success) return null;

  console.log(result)
  dispatch({
    type: SET_ARTICLES,
    result: result.data
  });
  return result;
};

export const getArticlesByUser = (user) => async (dispatch) => {
  const result = await getArticlesByUserAPI(user);
  if (!result.success) return null;
  console.log(result)
  return result;
};

export const getArticlesByName = (articlename) => async (dispatch) => {
  const result = await getArticlesByNameAPI(articlename);
  if (!result.success) return null;
  console.log(result)
  return result;
};

export const getArticlesById = (id) => async (dispatch) => {
  const result = await getArticlesByIdAPI(id);
  if (!result.success) return null;
  console.log(result)
  return result;
};

export const createNewArticle = (articleInfo) => async (dispatch) => {
  const result = await createNewArticleAPI(articleInfo);
  if (!result.success) return null;
  console.log(result)
  return result;
};

export const updateArticleInfo = (articleInfo) => async (dispatch) => {
  const result = await updateArticleInfoAPI(articleInfo);
  if (!result.success) return null;
  console.log(result)
  return result;
};

export const deleteArticle = (id) => async (dispatch) => {
  const result = await deleteArticleAPI(id);
  if (!result.success) return null;
  console.log(result)
  return result;
};