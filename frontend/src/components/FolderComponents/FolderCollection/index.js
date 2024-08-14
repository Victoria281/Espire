import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Folder, FolderOpen } from '@mui/icons-material';
import TabSelection from "../../ArticleComponents/TabSelection";
import AdminModal from "./AdminModal";
import ArticlesModal from "./ArticlesModal";
import CreateCollectionModal from "./CreateCollectionModal ";
import DeleteCollectionModal from "./DeleteCollectionModal";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import styles from './styles.module.css';
import { useDispatch } from 'react-redux';
import { handleBulkCreate, assignArticleToCollection, removeArticleFromCollection, createCollection } from "../../../store/actions/articles"
import { deleteCollectionAPI } from "../../../controller/articleController"
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';

const FolderCollection = ({ articles, collections }) => {
    const [rowView, setRowView] = useState(true);
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateCollectionModalOpen, setIsCreateCollectionModalOpen] = useState(false);
    const [isDeleteCollectionModalOpen, setIsDeleteCollectionModalOpen] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const toggleFileIcon = () => {
        setIsOpen(!isOpen);
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleOpenAdminModal = () => {
        setIsAdminModalOpen(true);
    };

    const handleSelectCollections = (ind) => {
        navigate(`/collection/${collections[ind].ID}`);
    }

    const handlePasswordSubmit = async () => {
        console.log('Admin password accepted');
        setLoading(true);
        await dispatch(handleBulkCreate()).then((success) => {
            if (success) {
                setLoading(false);
                setIsAdminModalOpen(false);
            }
        })
    };

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

    const handleOpenCreateCollectionModal = () => {
        setIsCreateCollectionModalOpen(true);
    };

    const handleCloseCreateCollectionModal = () => {
        setIsCreateCollectionModalOpen(false);
    };

    const handleCreateCollection = async (name) => {
        await dispatch(createCollection(name));
        handleCloseCreateCollectionModal();
    };

    const handleOpenDeleteCollectionModal = () => {
        setIsDeleteCollectionModalOpen(true);
    };

    const handleCloseDeleteCollectionModal = () => {
        setIsDeleteCollectionModalOpen(false);
        setErrMsg('');
    };

    const handleDeleteCollection = async (cid) => {
        if (cid) {
            setLoading(true);
            const { success, error } = await deleteCollectionAPI(cid);
            setLoading(false);
            if (success) {
                handleCloseDeleteCollectionModal();
                window.location.reload();
            } else {
                setErrMsg(error);
            }
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
            <AdminModal
                loading={loading}
                open={isAdminModalOpen}
                onSubmit={handlePasswordSubmit}
                setIsOpen={setIsAdminModalOpen}
            />
            <CreateCollectionModal
                open={isCreateCollectionModalOpen}
                onClose={handleCloseCreateCollectionModal}
                onCreate={handleCreateCollection}
            />
            <DeleteCollectionModal
                errmsg={errMsg}
                setErrMsg={setErrMsg}
                isOpen={isDeleteCollectionModalOpen}
                onClose={handleCloseDeleteCollectionModal}
                onConfirm={handleDeleteCollection}
                collections={collections}
            />
            <div className={styles.collectionMainContainer}>
                <div className={styles.collectionHead}>
                    <div className={styles.collectionAdmin}>
                        <p>Personal Collections</p>
                        <div onClick={() => handleOpenAdminModal()}>
                            <AdminPanelSettingsIcon />
                        </div>
                        <div onClick={() => handleOpenModal()}>
                            <DriveFileMoveIcon />
                        </div>
                        <div onClick={() => handleOpenCreateCollectionModal()}>
                            <AddBoxIcon />
                        </div>
                        <div onClick={() => handleOpenDeleteCollectionModal()}>
                            <DeleteIcon />
                        </div>
                    </div>
                    <TabSelection rowView={rowView} setRowView={setRowView} />
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

export default FolderCollection;
