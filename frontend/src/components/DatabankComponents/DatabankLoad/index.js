import React from "react";
import styles from './styles.module.css'
import { CircularProgress, Typography } from '@mui/material';

const DatabankLoad = ({ loadingMsg, query }) => {


    return (
        <div className={styles.loaderContainer}>
            <CircularProgress
                size={60}
                className={styles.loader} />
            <Typography variant="h6" color="textSecondary">
                Searching for
            </Typography>
            <p>{query}</p>
            <p>{loadingMsg}</p>
        </div>
    );
}

export default DatabankLoad;
