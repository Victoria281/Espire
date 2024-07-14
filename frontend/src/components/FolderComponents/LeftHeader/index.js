import React from 'react';
import styles from './styles.module.css';
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Logo from '../../common/Navbar/Logo';

const LeftHeader = () => {
    const navigate = useNavigate();
    const handleReturnClick = () => {
        navigate("/library")
    }

    return (
        <div className={styles.headerContainer}>
            <div className={styles.topContainer}>
                <div className={styles.backButton} onClick={() => handleReturnClick()}>
                    <KeyboardBackspaceIcon />
                </div>
                <Logo />
            </div>
            <p>All Articles</p>
        </div>
    );
};

export default LeftHeader;
