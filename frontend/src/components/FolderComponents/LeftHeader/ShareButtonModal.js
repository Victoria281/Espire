import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { searchUserFn, inviteUserFn, getInvitedUsersFn, removeUserFn } from '../../../functions/userInvite';

const ShareButtonModal = ({ isOpen, onClose, collectionID }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [invitedUsers, setInvitedUsers] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const results = await searchUserFn(collectionID, searchQuery);
        setSearchResults(results);
    };

    const handleInvite = async (username) => {
        await inviteUserFn(collectionID, username);
        setInvitedUsers(await getInvitedUsersFn(collectionID));
    };

    const handleRemove = async (username) => {
        await removeUserFn(collectionID, username);
        setInvitedUsers(await getInvitedUsersFn(collectionID));
    };

    const loadInvitedUsers = async () => {
        const users = await getInvitedUsersFn(collectionID);
        setInvitedUsers(users);
    };

    useEffect(() => {
        if (isOpen) {
            loadInvitedUsers();
        }
    }, [isOpen, collectionID]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Share This Article</h2>
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for a user..."
                            className={styles.searchInput}
                        />
                        <button type="submit" className={styles.searchButton}>Search</button>
                    </div>
                </form>
                <div className={styles.searchResults}>
                    {searchResults.map((user) => (
                        <div key={user.username} className={styles.userItem}>
                            <span>{user.username}</span>
                            <button onClick={() => handleInvite(user.username)} className={styles.inviteButton}>Invite</button>
                        </div>
                    ))}
                </div>
                <h3 className={styles.invitedTitle}>Already Invited</h3>
                <div className={styles.invitedUsers}>
                    {invitedUsers.map((user) => (
                        <div key={user.username} className={styles.userItem}>
                            <span>{user.username}</span>
                            <button onClick={() => handleRemove(user.username)} className={styles.removeButton}>Remove</button>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className={styles.closeButton}>Close</button>
            </div>
        </div>
    );
};

export default ShareButtonModal;
