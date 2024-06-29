import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";

import styles from './styles.module.css'

const SearchBar = ({ searchQuery, setSearchQuery, handleKeyPress, handleSearch }) => {
    const navigate = useNavigate();
    const navigateToMain = () => {
        navigate("/databank")
    }

    return (
        <div className={styles.searchHeader}>
            <p className={styles.searchTitle} onClick={navigateToMain}>Explore Articles</p>
            <div className={styles.searchBar}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Search..."
                    className={styles.searchInput}
                />
                <button onClick={handleSearch} className={styles.searchButton}>
                    <SearchIcon />
                </button>
            </div>
        </div>
    );
}

export default SearchBar;
