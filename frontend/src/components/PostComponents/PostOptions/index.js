import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import styles from './styles.module.css'
import ArticleCollection from "../../ArticleComponents/ArticleCollection";
import Button from "../../common/Button";

const PostOptions = ({ handleManualUpload, handleEnterLink }) => {


    return (
        <div className={styles.btnContainer}>
            <div className={styles.Btn}>
                <Button type="main" onClick={() => handleManualUpload()}>
                    Manual Upload
                </Button>
            </div>
            <div className={styles.Btn}>
                <Button type="main" onClick={() => handleEnterLink()}>
                    Enter Link
                </Button>
            </div>
        </div>
    );
}

export default PostOptions;
