import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import { getReccomendations, searchGoogleArticles, getAllTags } from "../store/actions/articles";
import { navigateToLogin } from "../functions/authFunctions";
import { saveUserHistoryAPI } from "../controller/userController";
import SearchBar from "../components/DatabankComponents/SearchBar";
import TagBar from "../components/DatabankComponents/TagBar";
import DatabankSearchResults from "../components/DatabankComponents/DatabankSearchResults";
import DatabankLoad from "../components/DatabankComponents/DatabankLoad";
import RecommendedList from "../components/DatabankComponents/ReccomendedList";
import queryString from 'query-string';
import styles from "../components/DatabankComponents/ReccomendedList/styles.module.css"
const DatabankScreen = () => {
  const [ogReccomendationList, setOgReccomendationList] = useState([]);
  const [ogPopularList, setOgPopularList] = useState([]);
  const [reccomendationList, setReccomendationList] = useState([]);
  const [popularList, setPopularList] = useState([]);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = useSelector(state => state.user.token);
  const searchResults = useSelector(state => state.articles.search);
  const tags = useSelector(state => state.articles.tags);
  const searchloader = useSelector(state => state.articles.searchloader)

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/databank?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTagSearch = () => {
    // Implement tag search logic here
  };

  const handleTagKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleTagSearch();
    }
  };

  const handleRetrieveReccomendations = async () => {
    setLoading(true);
    await dispatch(getReccomendations()).then((result) => {
      if (result.success) {
        console.log(result.data);
        setReccomendationList(result.data.recommendations);
        setOgReccomendationList(result.data.recommendations);
        setPopularList(result.data.popular);
        setOgPopularList(result.data.popular)
        setLoading(false);
      }
    });
  };

  const handleClickArticle = (id) => {
    saveUserHistoryAPI(id);
    navigate(`/articles/${id}`);
  };

  

  useEffect(() => {
    const fetchData = async () => {
      const query = queryString.parse(location.search).query;
      if (token !== undefined) {
        dispatch(getAllTags());

        if (query !== undefined) {
          setSearching(true);
          setLoading(true);
          setSearchQuery(query);
          await dispatch(searchGoogleArticles(query)).then((result) => {
            if (result.success) {
              setLoading(false);
            }
          });
        } else {
          setSearching(false);
          await handleRetrieveReccomendations();
        }
      } else {
        navigateToLogin(navigate);
      }
    };

    fetchData();
  }, [location.search, token, dispatch, navigate]);

  return (
    <div className="mainContainer restrictScroll">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleKeyPress={handleKeyPress} handleSearch={handleSearch} />

      {tags && (
        <TagBar
        ogReccomendationList={ogReccomendationList}
        setReccomendationList={setReccomendationList}
        ogPopularList={ogPopularList}
        setPopularList={setPopularList}
          tags={tags}
          tagSearchQuery={tagSearchQuery}
          setTagSearchQuery={setTagSearchQuery}
          handleTagKeyPress={handleTagKeyPress}
          handleTagSearch={handleTagSearch}
          activeTab={activeTab}
        />
      )}

      <div className={styles.tabs}>
        <button onClick={() => setActiveTab('recommendations')} className={activeTab === 'recommendations' ? styles.active : ''}>Recommendations</button>
        <button onClick={() => setActiveTab('popular')} className={activeTab === 'popular' ? styles.active : ''}>Popular</button>
      </div>

      {searching && (!loading ?
        searchResults.web?.length > 0 ?
          <DatabankSearchResults results={searchResults} />
          :
          <DatabankLoad loadingMsg={searchloader} query={searchQuery} />
        :
        <DatabankLoad loadingMsg={"Searching..."} query={searchQuery} />
      )}

      {!searching && (!loading ?
        activeTab === 'recommendations' ?
          <RecommendedList reccomendationList={reccomendationList} handleRetrieveReccomendations={handleRetrieveReccomendations} handleClickArticle={handleClickArticle} popular={false} />
          :
          <RecommendedList reccomendationList={popularList} handleRetrieveReccomendations={handleRetrieveReccomendations} handleClickArticle={handleClickArticle} popular={true} />
        :
        <DatabankLoad loadingMsg={"Retrieving articles..."} query={""} />
      )}
    </div>
  );
};

export default DatabankScreen;
