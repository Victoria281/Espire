import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { retrieveownArticles } from "../functions/articles";
import TabSelection from "../components/ArticleComponents/TabSelection";
import ArticleCollection from "../components/ArticleComponents/ArticleCollection";

const LibraryScreen = () => {
  const [articleView, setArticleView] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector(state => state.user.token);
  const articles = useSelector(state => state.articles.articles);

  const switchTabs = () => {
    setArticleView(!articleView);
  }

  useEffect(() => {
    if (token != undefined) {
      retrieveownArticles(dispatch);
    }
  }, [])

  return (
    <div className="mainContainer restrictScroll">
      <TabSelection articleView={articleView} setArticleView={setArticleView} />
      {
        articleView ?
          <ArticleCollection articles={articles} />
          :
          <div>
            Coming Soon
          </div>
      }

    </div>
  );
};

export default LibraryScreen;
