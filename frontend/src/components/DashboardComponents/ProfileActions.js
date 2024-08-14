import React from 'react';
import styles from './styles.module.css';

const ProfileActions = ({ onUpdatePassword, onDeleteAccount }) => {
    return (
        <div className={styles.header}>
            <h1>User Profile</h1>
            <div className={styles.profileActions}>
                <button onClick={onUpdatePassword} className={styles.actionButton}>Update Password</button>
                <button onClick={onDeleteAccount} className={styles.actionButton}>Delete Account</button>
            </div>
        </div>
    );
};

export default ProfileActions;