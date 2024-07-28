import React, { useState, useEffect } from 'react';
import { TextField, Modal, Button, List, ListItem, ListItemText, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useSelector } from 'react-redux'; 
import { addUserTag, removeUserTag } from '../../functions/dashboard';
import styles from './styles.module.css'; 

const TagsSection = ({ utags, setUTags }) => {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [availableTags, setAvailableTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');
  
    const allTags = useSelector((state) => state.articles.tags); 
  
    useEffect(() => {
      setAvailableTags(allTags);
    }, [allTags]);
  
    useEffect(() => {
      const results = availableTags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTags(results);
    }, [searchTerm, availableTags]);
  
    const handleTagSelection = async (tag) => {
      if (utags.find((userTag) => userTag.id === tag.ID)) {
        const result = await removeUserTag(tag.ID);
        if (result.success) {
          setUTags((prevTags) => prevTags.filter((userTag) => userTag.id !== tag.ID));
        } else {
          setError(result.error);
        }
      } else {
        if (utags.length >= 5) {
          setError('You can only select up to 5 tags.');
          return;
        }
  
        const result = await addUserTag(tag.ID);
        if (result.success) {
          setUTags((prevTags) => [...prevTags, { ...tag, id: tag.ID }]);
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
          <div className={styles.selectedTags}>
            {utags.map((tag) => (
              <div key={tag.ID} className={styles.selectedTag}>
                {tag.name}
              </div>
            ))}
            {utags.length ==0 && <p>No tags selected.</p>}
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
                        checked={utags.some((userTag) => userTag.id === tag.ID)}
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