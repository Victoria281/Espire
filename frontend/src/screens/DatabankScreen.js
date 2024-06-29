import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import { searchArticles, getAllTags } from "../store/actions/articles";
import { navigateToLogin } from "../functions/authFunctions";
import SearchBar from "../components/DatabankComponents/SearchBar";
import TagBar from "../components/DatabankComponents/TagBar";
import DatabankSearchResults from "../components/DatabankComponents/DatabankSearchResults";
import queryString from 'query-string';

const DatabankScreen = () => {
  const [searchedList, setSearchedList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = useSelector(state => state.user.token);
  const searchResults = useSelector(state => state.articles.search);
  const tags = useSelector(state => state.articles.tags);


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

  useEffect(() => {
    const query = queryString.parse(location.search).query;
    if (token != undefined) {
      dispatch(getAllTags())
      if (query != undefined) {
        setSearching(true);
        setSearchQuery(query)
        dispatch(searchArticles(query))
      }
    } else {
      navigateToLogin(navigate);
    }
  }, [location.search, token, dispatch, navigate]);

  return (
    <div className="mainContainer restrictScroll">

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleKeyPress={handleKeyPress} handleSearch={handleSearch} />

      <TagBar tags={tags} tagSearchQuery={tagSearchQuery} setTagSearchQuery={setTagSearchQuery} handleTagKeyPress={handleTagKeyPress} handleTagSearch={handleTagSearch} />

      {searching ?
        searchResults.web.length != 0 &&
        <DatabankSearchResults results={searchResults} />
        :
        <div>dfdf</div>
      }


    </div>
  );
};

export default DatabankScreen;
