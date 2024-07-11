import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Folder, FolderOpen } from '@mui/icons-material'; // Import the file icons
import styles from './styles.module.css';

const FolderCollection = ({ collections }) => {
    const [isRowLayout, setIsRowLayout] = useState(true);
    const [isOpen, setIsOpen] = useState(true); // State for file icon open/close

    const toggleLayout = () => {
        setIsRowLayout(!isRowLayout);
    };

    const toggleFileIcon = () => {
        setIsOpen(!isOpen);
    };

    const navigate = useNavigate();

    const handleSelectCollections = (ind) => {
        navigate(`/collection/${collections[ind].ID}`);
    }

    return (
        <div>
            <Button
                onClick={toggleLayout}
                variant="contained"
                color="primary"
                className={styles.toggleButton}
            >
                {isRowLayout ? 'Switch to Column View' : 'Switch to Row View'}
            </Button>
            <Box
                className={isRowLayout ? styles.rowLayout : styles.columnLayout}
            >
                {collections.map((collection, index) => (
                    <Box
                        key={collection.ID}
                        className={styles.collectionItem}
                        onClick={() => handleSelectCollections(index)}
                    >
                        <div
                            className={`${styles.fileIcon} ${isOpen ? styles.fileIconOpen : ''}`}
                            onClick={toggleFileIcon}
                        >
                            {isOpen ? <FolderOpen /> : <Folder />}
                        </div>
                        <Typography variant="h6" className={styles.collectionName}>
                            {collection.name}
                        </Typography>
                        <Typography variant="body2" className={styles.collectionDate}>
                            Created: {new Date(collection.createdat).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" className={styles.articleCount}>
                            Articles: {collection.Articles.length}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </div>
    );
}

export default FolderCollection;
