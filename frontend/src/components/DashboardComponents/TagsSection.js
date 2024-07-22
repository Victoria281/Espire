import React, { useState, useEffect } from 'react';
import { TextField, Modal, Button, List, ListItem, ListItemText, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector and useDispatch
import { addUserTag, removeUserTag, fetchUserTags } from '../../functions/dashboard'; // Adjust import path
import styles from './styles.module.css'; // Import CSS module

const TagsSection = () => {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [userTags, setUserTags] = useState([]); // Local state for user tags
    const [availableTags, setAvailableTags] = useState([]); // State for available tags
    const [filteredTags, setFilteredTags] = useState([]); // State for filtered tags
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
  
    const dispatch = useDispatch();
    const allTags = useSelector((state) => state.articles.tags); // Adjust according to your Redux state
  
    useEffect(() => {
      const fetchTags = async () => {
        // Fetch user tags
        const userTagsResponse = await fetchUserTags();
        if (userTagsResponse.success) {
          setUserTags(userTagsResponse.data);
        } else {
          setError(userTagsResponse.error);
        }
      };
  
      // Fetch available tags
      setAvailableTags(allTags);
  
      fetchTags();
    }, [allTags]);
  
    useEffect(() => {
      // Filter tags based on the search term
      const results = availableTags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTags(results);
    }, [searchTerm, availableTags]);
  
    const handleTagSelection = async (tag) => {
      if (userTags.find((userTag) => userTag.id === tag.ID)) {
        const result = await removeUserTag(tag.ID);
        if (result.success) {
          setUserTags((prevTags) => prevTags.filter((userTag) => userTag.id !== tag.ID));
        } else {
          setError(result.error);
        }
      } else {
        if (userTags.length >= 5) {
          setError('You can only select up to 5 tags.');
          return;
        }
  
        const result = await addUserTag(tag.ID);
        if (result.success) {
          setUserTags((prevTags) => [...prevTags, tag]);
          setError(null);
        } else {
          setError(result.error);
        }
      }
    };
  
    return (
      <section className={styles.dashboardSection}>
        <Typography variant="h6">Preferred Tags</Typography>
  
        <div className={styles.selectedTagsSection}>
          <Typography variant="subtitle1" className={styles.tagSelectionHeader}>
            Selected Tags
          </Typography>
          <div className={styles.selectedTags}>
            {userTags.map((tag) => (
              <div key={tag.ID} className={styles.selectedTag}>
                {tag.name}
              </div>
            ))}
          </div>
        </div>
  
        <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
          Manage Tags
        </Button>
  
        {error && <Typography color="error" className={styles.error}>{error}</Typography>}
  
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div className={styles.modalContent}>
            <Typography variant="h6">Manage Tags</Typography>
            <div className={styles.searchBarContainer}>
              <TextField
                className={styles.searchBar}
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <List>
              {filteredTags.map((tag) => (
                <ListItem key={tag.ID} className={styles.tagItem}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={userTags.some((userTag) => userTag.id === tag.ID)}
                        onChange={() => handleTagSelection(tag)}
                      />
                    }
                    label={tag.name}
                  />
                </ListItem>
              ))}
            </List>
            <Button variant="contained" color="primary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
        </Modal>
      </section>
    );
  };
  
  export default TagsSection;