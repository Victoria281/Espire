import { getMyArticles, getArticlesById, getMyCollections, getMySharedCollections } from '../store/actions/articles';

export const retrieveownArticles = (dispatch) => {
    console.log('Retrieving Articles List...');
    dispatch(getMyArticles())
    console.log('Retrieving Collections List...');
    dispatch(getMyCollections())
    console.log('Retrieving Shared Collections List...');
    dispatch(getMySharedCollections())
}

export const retrieveArticleById = (id, dispatch) => {
    console.log('Retrieving Article ...');
    dispatch(getArticlesById(id))
}

// export const retrieveCollectionById = (id, dispatch) => {
//     console.log('Retrieving Collection ...');
//     dispatch(getCollectionById(id))
// }
