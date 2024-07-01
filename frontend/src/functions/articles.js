import { getMyArticles, getArticlesById } from '../store/actions/articles';

export const retrieveownArticles = (dispatch) => {
    console.log('Retrieving Articles List...');
    dispatch(getMyArticles())
}

export const retrieveArticleById = (id, dispatch) => {
    console.log('Retrieving Article ...');
    dispatch(getArticlesById(id))
}
