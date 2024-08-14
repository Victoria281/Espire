import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import styles from './styles.module.css'
import ArticleCollection from "../../ArticleComponents/ArticleCollection";
import SearchWebResults from "../../ArticleComponents/SearchWebResults";

const ForkOptions = ({ }) => {


    return (
        <div>
            <div className={styles.divider}>
                <div className={styles.line}></div>
                <h1 className={styles.dividerText}>or</h1>
                <div className={styles.line}></div>
            </div>
            <h1 className={styles.forkTitle}>Fork from existing posts of the same articles [coming soon]</h1>
            
        </div>
    );
}

export default ForkOptions;
