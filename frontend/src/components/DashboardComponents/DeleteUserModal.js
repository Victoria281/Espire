import React, { useState } from 'react';
import styles from './styles.module.css';

const DeleteUserModal = ({ errmsg, setErrMsg, isOpen, onClose, onConfirm }) => {
  const [confirmationText, setConfirmationText] = useState('');

  const handleConfirm = () => {
    if (confirmationText === 'confirm') {
      onConfirm();
    } else {
        setErrMsg("Please type 'confirm' to proceed with deletion.");
    }
  };

  return (
    isOpen && (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2 className={styles.modalTitle}>Delete Account</h2>
          <p className={styles.modalText}>Are you sure you want to delete your account? This action cannot be undone.</p>
          <p className={styles.error}>{errmsg}</p>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Type 'confirm' to delete"
            className={styles.confirmationInput}
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

export default DeleteUserModal;
