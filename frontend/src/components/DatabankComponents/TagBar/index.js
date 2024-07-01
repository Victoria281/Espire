import { useState, useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import styles from './styles.module.css'

const TagBar = ({ tags, tagSearchQuery, setTagSearchQuery, handleTagKeyPress, handleTagSearch }) => {

    const [selected, setSelected] = useState([]);

    const isSelected = (id) => {
        return selected.includes(id);
    }

    const handleSelectTags = (item) => {
        let newSelected = [...selected];
        newSelected.push(item.ID)
        setSelected(newSelected)
    }

    return (
        <div className={styles.tagContainer}>
            <div className={styles.searchBar}>
                <input
                    type="text"
                    value={tagSearchQuery}
                    onChange={(e) => setTagSearchQuery(e.target.value)}
                    onKeyDown={handleTagKeyPress}
                    placeholder="Search for tags"
                    className={styles.searchInput}
                />
                <button onClick={handleTagSearch} className={styles.searchButton}>
                    <SearchIcon />
                </button>
            </div>
            <div className={styles.tagItemContainer}>
                {tags.map((item, index) =>
                    <div onClick={() => handleSelectTags(item)} className={styles[`tagItem${isSelected(item.ID) ? '-selected' : ''}`]}>
                        <p>{item.name}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TagBar;
