import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import { searchArticles, getAllTags } from "../store/actions/articles";
import { navigateToLogin } from "../functions/authFunctions";
import SearchBar from "../components/DatabankComponents/SearchBar";
import TagBar from "../components/DatabankComponents/TagBar";
import DatabankSearchResults from "../components/DatabankComponents/DatabankSearchResults";
import DatabankLoad from "../components/DatabankComponents/DatabankLoad";
import queryString from 'query-string';

const DatabankScreen = () => {
  const [searchedList, setSearchedList] = useState([]);
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

    const fetchData = async () => {
      const query = queryString.parse(location.search).query;
      if (token !== undefined) {
        dispatch(getAllTags());

        if (query !== undefined) {
          setSearching(true);
          setLoading(true);
          setSearchQuery(query);
          await dispatch(searchArticles(query)).then((result) => {
            if (result.success) {
              console.log("result")
              console.log(result)
              setLoading(false);
            }
          });
        } else {
          setSearching(false);
          setLoading(false);
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

      <TagBar tags={tags} tagSearchQuery={tagSearchQuery} setTagSearchQuery={setTagSearchQuery} handleTagKeyPress={handleTagKeyPress} handleTagSearch={handleTagSearch} />

      {searching && (!loading ?
        searchResults.web?.length != 0 &&
        <DatabankSearchResults results={searchResults} />
        :
        <DatabankLoad query={searchQuery} />
      )}

      {!searching &&
        <div>
          show reccomendation
        </div>
      }


    </div>
  );
};

export default DatabankScreen;
