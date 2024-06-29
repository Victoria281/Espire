import {
  SET_ARTICLES,
  SET_ARTICLE_WORKSPACE,
  SET_SEARCH_RESULTS,
  SET_TAGS
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
  },
  search: {
    database: [],
    web: []
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
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        search: action.search
      };
    case SET_TAGS:
      return {
        ...state,
        tags: action.tags
      };
    case CLEAR_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
