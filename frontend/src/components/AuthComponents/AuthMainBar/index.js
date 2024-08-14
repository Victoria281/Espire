import React from "react";
import styles from './styles.module.css'
import Button from "@mui/material/Button";
import { CircularProgress, Typography } from '@mui/material';

const AuthMainBar = ({ loading, title, btn, onClick, children }) => {
    return (
        <div className={styles.authMainBarContainer} >
            {loading ?
                <>

                    <CircularProgress
                        size={60} />
                    <Typography variant="h6" color="textSecondary">
                        Loading... Please Wait...
                    </Typography>
                </>
                :
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

            }
        </div>
    );
}

export default AuthMainBar;
