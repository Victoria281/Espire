import { useState, useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import styles from './styles.module.css';

const TagBar = ({ ogReccomendationList, setReccomendationList, ogPopularList, setPopularList, tags, tagSearchQuery, setTagSearchQuery, handleTagKeyPress, handleTagSearch, activeTab }) => {
    const [selected, setSelected] = useState([]);

    const isSelected = (id) => selected.includes(id);

    const handleSelectTags = (item) => {
        let newSelected;
        if (isSelected(item.ID)) {
            newSelected = selected.filter(id => id !== item.ID);
        } else {
            newSelected = [...selected, item.ID];
        }
        setSelected(newSelected);

        
        if (activeTab=== 'recommendations') {
            if (newSelected.length > 0) {
                let updatedRecommendationList = ogReccomendationList;
                newSelected.forEach(tagID => {
                    updatedRecommendationList = updatedRecommendationList.filter(rec =>
                        rec.Tags && rec.Tags.some(tag => tag.ID === tagID)
                    );
                });
                setReccomendationList(updatedRecommendationList);
            } else {
                setReccomendationList(ogReccomendationList);
            }
        } else {
        if (newSelected.length > 0) {
            let updatedPopList = ogPopularList;
            newSelected.forEach(tagID => {
                updatedPopList = updatedPopList.filter(rec =>
                    rec.Article.Tags && rec.Article.Tags.some(tag => tag.ID === tagID)
                );
            });
            setPopularList(updatedPopList);
        } else {
            setPopularList(ogPopularList);
        }
        }
        
    };

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
    );

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
                {filteredTags.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleSelectTags(item)}
                        className={`${styles.tagItem} ${isSelected(item.ID) ? styles.selected : ''}`}
                    >
                        <p>{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TagBar;
