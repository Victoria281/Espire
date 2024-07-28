import React, { useState } from 'react';
import styles from './styles.module.css';
import { CircularProgress } from '@mui/material';
import { updatePasswordAPI } from '../../controller/userController';

const UpdatePasswordModal = ({ isOpen, onClose }) => {
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = () => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!oldPassword || !newPassword) {
            setError("Both old and new passwords must be provided");
            return;
          }
        
        if (!passwordRegex.test(newPassword)) {
          setError("Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one number");
          return;
        }
      
        setLoading(true);
        updatePasswordAPI(oldPassword, newPassword)
            .then(({ success, error }) => {
                setLoading(false);
                if (success) {
                    setError("Success!");
                    setNewPassword('')
                    setOldPassword('')
                    setTimeout(()=>{
                        onClose();
                    }, 2000)
                } else {
                    setError(error);
                }
            });
    };

    return (
        isOpen && (
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h2 className={styles.modalTitle}>Update Password</h2>
                    {error && <div className={styles.error}>{error}</div>}
                    {loading
                        ?
                        <CircularProgress
                            size={60} />
                        :
                        <>
                            <input
                                type="password"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className={styles.input}
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={styles.input}
                            />
                            <button onClick={handleUpdatePassword} className={styles.button}>Update</button>
                            <button onClick={onClose} className={styles.button}>Cancel</button>
                        </>
                    }
                </div>
            </div>
        )
    );
};

export default UpdatePasswordModal;
