import React, { useState } from 'react';
import styles from './styles.module.css';

const DeleteCollectionModal = ({ errmsg, setErrMsg, isOpen, onClose, onConfirm, collections }) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');

  const handleConfirm = () => {
    if (confirmationText === 'confirm' && selectedCollectionId) {
      onConfirm(selectedCollectionId); 
    } else {
      setErrMsg("Please type 'confirm' and select a collection to proceed with deletion.");
    }
  };

  return (
    isOpen && (
      <div className={styles.deleteModalOverlay}>
        <div className={styles.deleteModal}>
          <h2 className={styles.deleteModalTitle}>Delete Collection</h2>
          <p className={styles.deleteModalText}>
            Are you sure you want to delete this collection? This action cannot be undone.
          </p>
          <p className={styles.deleteError}>{errmsg}</p>
          
          <select
            value={selectedCollectionId}
            onChange={(e) => setSelectedCollectionId(e.target.value)}
            className={styles.collectionSelect}
          >
            <option value="" disabled>Select a collection to delete</option>
            {collections.map((collection) => (
              <option key={collection.ID} value={collection.ID}>
                {collection.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Type 'confirm' to delete"
            className={styles.deleteConfirmationInput}
          />
          <div className={styles.buttonContainer}>
            <button onClick={handleConfirm} className={`${styles.button} ${styles.deleteButton}`}>Delete</button>
            <button onClick={onClose} className={styles.button}>Cancel</button>
          </div>
        </div>
      </div>
    )
  );
};

export default DeleteCollectionModal;
