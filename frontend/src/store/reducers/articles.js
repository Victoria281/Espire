import {
  SET_ARTICLES,
  SET_ARTICLE_WORKSPACE
} from '../actions/articles';
import {
  CLEAR_STATE
} from '../actions/user';

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
      case SET_ARTICLE_WORKSPACE:
        return {
          ...state,
          workspace: action.workspace
        };
        case CLEAR_STATE:
          return initialState;
    default:
      return state;
  }
};

export default reducer;
