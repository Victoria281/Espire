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
import ReccomendedList from "../components/DatabankComponents/ReccomendedList";
import queryString from 'query-string';

const DatabankScreen = () => {
  const [ogReccomendationList, setOgReccomendationList] = useState([]);
  const [reccomendationList, setReccomendationList] = useState([]);
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
    if (searchQuery.trim() !== '') {
    }
  };

  const handleTagKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRetrieveReccomendations = async () => {
    setLoading(true);
    await dispatch(getReccomendations()).then((result) => {
      if (result.success) {
        console.log(result.data)
        setReccomendationList(result.data.recommendations)
        setOgReccomendationList(result.data.recommendations)
        setLoading(false);
      }
    });
  };

  const handleClickArticle = (id) => {
    //save user hsitory
    saveUserHistoryAPI(id);
    navigate(`/articles/${id}`)
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

      {tags != undefined && <TagBar ogReccomendationList={ogReccomendationList} reccomendationList={reccomendationList} setReccomendationList={setReccomendationList} tags={tags} tagSearchQuery={tagSearchQuery} setTagSearchQuery={setTagSearchQuery} handleTagKeyPress={handleTagKeyPress} handleTagSearch={handleTagSearch} />}

      {searching && (!loading ?
        searchResults.web?.length != 0 &&
        <DatabankSearchResults results={searchResults} />
        :
        <DatabankLoad loadingMsg={searchloader} query={searchQuery} />
      )}

      {!searching && (!loading ?
        reccomendationList.length != 0 &&
        <ReccomendedList reccomendationList={reccomendationList} handleRetrieveReccomendations={handleRetrieveReccomendations} handleClickArticle={handleClickArticle}/>
        :
        <DatabankLoad loadingMsg={"Retrieving articles..."} query={""} />
      )}


    </div>
  );
};

export default DatabankScreen;
