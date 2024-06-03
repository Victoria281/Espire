import React from "react";
import styles from './styles.module.css'
import Button from "@mui/material/Button";

const AuthMainBar = ({ title, btn, onClick, children }) => {
    return (
        <div className={styles.authMainBarContainer} >
            <div className={styles.authMainBarItem}>
                <p className={styles.authTitle}>{title}</p>
                {children}
                <Button
                    type="submit"
                    variant="contained"
                    onClick={onClick}
                    className={styles.authMainBarContainerBtn}
                >
                    {btn}
                </Button>
            </div>
        </div>
    );
}

export default AuthMainBar;
