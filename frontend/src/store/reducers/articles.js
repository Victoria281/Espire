import {
  SET_ARTICLES
} from '../actions/articles';

const initialState = {
  collections: [],
  articles: [],
  workspace: {
    article: {},
    collectionId: null
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ARTICLES:
      return {
        ...state,
        articles: action.articles
      };
    default:
      return state;
  }
};

export default reducer;
