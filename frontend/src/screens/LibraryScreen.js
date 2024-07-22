import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { retrieveownArticles } from "../functions/articles";
import { logout } from "../functions/auth";
import ArticleCollection from "../components/ArticleComponents/ArticleCollection";
import FolderCollection from "../components/FolderComponents/FolderCollection";
import SharedCollection from "../components/FolderComponents/SharedCollection";

const LibraryScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector(state => state.user.token);
  const articles = useSelector(state => state.articles.articles);
  const collections = useSelector(state => state.articles.collections);
  const shared_collections = useSelector(state => state.articles.shared_collections);


  useEffect(() => {
    if (token != undefined) {
      retrieveownArticles(dispatch);
    } else {
      logout(dispatch, navigate);
    }
  }, [])

  return (
    <div className="mainContainer restrictScroll">
      <FolderCollection articles={articles} collections={collections} />
      {shared_collections.length>0 && <SharedCollection articles={articles} collections={shared_collections} />}
      <ArticleCollection articles={articles} />
    </div>
  );
};

export default LibraryScreen;
