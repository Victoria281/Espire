import { getMyArticles, getArticlesById, getMyCollections } from '../store/actions/articles';

export const retrieveownArticles = (dispatch) => {
    console.log('Retrieving Articles List...');
    dispatch(getMyArticles())
    console.log('Retrieving Collections List...');
    dispatch(getMyCollections())
}

export const retrieveArticleById = (id, dispatch) => {
    console.log('Retrieving Article ...');
    dispatch(getArticlesById(id))
}
