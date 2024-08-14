import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, Select, MenuItem, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import styles from './styles.module.css';

const ArticlesModal = ({ open, onClose, collections, articles, onUpdate }) => {
    const [selectedCollectionIndex, setSelectedCollectionIndex] = useState(0);
    const [collectionArticles, setCollectionArticles] = useState([]);
    const [availableArticles, setAvailableArticles] = useState([]);

    useEffect(() => {
        if (selectedCollectionIndex >= 0) {
            const collection = collections[selectedCollectionIndex];
            setCollectionArticles(collection?.Articles || []);
            setAvailableArticles(
                articles.filter(article => !collection?.Articles.some(a => a.id === article.id))
            );
        } else {
            setCollectionArticles([]);
            setAvailableArticles(articles);
        }
    }, [selectedCollectionIndex, collections, articles]);

    const handleCollectionChange = (event) => {
        setSelectedCollectionIndex(event.target.value);
    };

    const handleAddArticle = (articleId) => {
        const collectionId = collections[selectedCollectionIndex].ID;
        onUpdate(collectionId, 'add', articleId);
    };

    const handleRemoveArticle = (articleId) => {
        const collectionId = collections[selectedCollectionIndex].ID;
        onUpdate(collectionId, 'remove', articleId);
    };

    return (
        <Modal open={open} onClose={onClose} className={styles.modal}>
            <div className={styles.modalContent}>
                <Typography variant="h6" className={styles.header}>Move Articles to Collection</Typography>
                <Select
                    value={selectedCollectionIndex}
                    onChange={handleCollectionChange}
                    fullWidth
                    className={styles.select}
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select a Collection</MenuItem>
                    {collections.map((collection, index) => (
                        <MenuItem key={collection.ID} value={index}>
                            {collection.name}
                        </MenuItem>
                    ))}
                </Select>
                <div className={styles.listsContainer}>
                    <div className={styles.listContainer}>
                        <Typography variant="subtitle1" className={styles.listTitle}>Articles in Collection</Typography>
                        <List>
                            {collectionArticles.map((article) => (
                                <ListItem key={article.id} className={styles.listItem}>
                                    <ListItemText
                                        primary={article.name}
                                    />
                                    <IconButton
                                        onClick={() => handleRemoveArticle(article.id)}
                                        className={styles.removeButton}
                                    >
                                        <Remove />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <div className={styles.listContainer}>
                        <Typography variant="subtitle1" className={styles.listTitle}>Available Articles</Typography>
                        <List>
                            {availableArticles.map((article) => (
                                <ListItem key={article.id} className={styles.listItem}>
                                    <ListItemText
                                        primary={article.name}
                                    />
                                    <IconButton
                                        onClick={() => handleAddArticle(article.id)}
                                        className={styles.addButton}
                                    >
                                        <Add />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClose}
                    className={styles.closeButton}
                >
                    Close
                </Button>
            </div>
        </Modal>
    );
};

export default ArticlesModal;
