import React, { useState } from "react";
import styles from './styles.module.css';
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ShareButtonModal from './ShareButtonModal';

const LeftHeader = ({ collectionID }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleReturnClick = () => {
        navigate("/library")
    }

    const handleShareButtonClick = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    return (
        <div className={styles.headerContainer}>
            <div className={styles.topContainer}>
                <div className={styles.backButton} onClick={() => handleReturnClick()}>
                    <KeyboardBackspaceIcon />
                </div>
                <div className={styles.shareButton} onClick={handleShareButtonClick}>
                    Share
                </div>
            </div>
            <p>All Articles</p>
            <ShareButtonModal isOpen={isModalOpen} onClose={handleCloseModal} collectionID={collectionID}/>
        </div>
    );
};

export default LeftHeader;
