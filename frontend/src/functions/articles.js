import { getMyArticles, getArticlesById } from '../store/actions/articles';

export const retrieveownArticles = (dispatch) => {
    console.log('Retrieving Articles List...');
    dispatch(getMyArticles())
}

export const retrieveArticleById = (id, dispatch) => {
    console.log('Retrieving Article ...');
    dispatch(getArticlesById(id))
}

// export const createNewProjectFunction = (name, dispatch, navigate) => {
//     dispatch(displayLoader(true, DEFAULT_LOADER));
//     dispatch(createNewProject(name)).then((result) => {
//         if (result.success) {
//             dispatch(displayInfoModal('Created new project...'));
//             navigate('/projects/' + result.data.id)
//         }
//     })
//     dispatch(displayLoader(false));
// }

// export const retrieveArticleInformation = (dispatch, projectid) => {
//     dispatch(displayLoader(true, DEFAULT_LOADER));
//     dispatch(getProjectInfoByPid(projectid))
//     dispatch(displayLoader(false));
// }