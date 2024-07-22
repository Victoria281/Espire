import React, { useState } from 'react';
import { Modal, Button, TextField, Typography } from '@mui/material';
import styles from './styles.module.css';

const CreateCollectionModal = ({ open, onClose, onCreate }) => {
    const [collectionName, setCollectionName] = useState('');
    const [error, setError] = useState('');

    const handleClose = (e) => {
        e.stopPropagation();
        onClose();
    };

    const handleCreate = () => {
        if (collectionName.trim()) {
            onCreate(collectionName);
            setCollectionName('');
            onClose();
        } else {
            setError('Collection name cannot be empty');
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            className={styles.modal}
        >
            <div className={styles.modalContent}>
                <Typography variant="h6" className={styles.header}>
                    Create New Collection
                </Typography>
                <TextField
                    label="Collection Name"
                    variant="outlined"
                    fullWidth
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    className={styles.textField}
                    error={!!error}
                    helperText={error}
                />
                <div className={styles.buttonContainer}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreate}
                        className={styles.createButton}
                    >
                        Create
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleClose}
                        className={styles.cancelButton}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CreateCollectionModal;
