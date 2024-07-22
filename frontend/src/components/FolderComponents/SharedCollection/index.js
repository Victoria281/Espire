import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Folder, FolderOpen } from '@mui/icons-material';
import TabSelection from "../../ArticleComponents/TabSelection";
import ArticlesModal from "./ArticlesModal";
import styles from './styles.module.css';
import { useDispatch } from 'react-redux';
import { handleBulkCreate, assignArticleToCollection, removeArticleFromCollection } from "../../../store/actions/articles"
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';

const SharedCollection = ({ articles, collections }) => {
    const [rowView, setRowView] = useState(true);
    const [isOpen, setIsOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleFileIcon = () => {
        setIsOpen(!isOpen);
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSelectCollections = (ind) => {
        navigate(`/shared/collection/${collections[ind].ID}`);
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUpdate = (cid, action, aid) => {
        if (action === 'add') {
            dispatch(assignArticleToCollection([aid], cid))
        } else if (action === 'remove') {
            dispatch(removeArticleFromCollection([aid], cid))
        }
    };

    return (
        <>
            <ArticlesModal
                open={isModalOpen}
                onClose={handleCloseModal}
                collections={collections}
                articles={articles}
                onUpdate={handleUpdate}
            />
            <div className={styles.collectionMainContainer}>
                <div className={styles.collectionHead}>
                    <div className={styles.collectionAdmin}>
                        <p>Shared Collections</p>
                    </div>
                </div>
                <div className={styles[`collection${rowView ? '' : 'Column'}Container`]}>
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
                            <p className={styles.collectionName}>
                                {collection.name}
                            </p>
                            <p className={styles.collectionDate}>
                                Owned by {collection.username}
                            </p>
                            <p variant="body2" className={styles.collectionDate}>
                                Created: {new Date(collection.createdat).toLocaleDateString()}
                            </p>
                            <p variant="body2" className={styles.articleCount}>
                                Articles: {collection.Articles.length}
                            </p>
                        </Box>
                    ))}
                </div>
            </div>
        </>
    );
}

export default SharedCollection;
