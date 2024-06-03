import React from "react";
import { TAB1, TAB2 } from "../../../constants/names"
import styles from './styles.module.css'
import Button from "../../common/Button";
import ErrorMessage from "../../common/ErrorMessage";
import { useLocation } from "react-router-dom";

const PostButton = ({ msg, onClick }) => {

    const location = useLocation();

    const isEditing = () => {
        return location.pathname.split('/').length >= 3
    }

    return (
        <div className={styles.postButtonContainer}>
            <ErrorMessage msg={msg} />

            {isEditing() ?
                <Button type="main" onClick={() => onClick(false)}>
                    Save
                </Button>
                :
                <Button type="main" onClick={() => onClick(true)}>
                    Post
                </Button>
            }
        </div>

    );
}

export default PostButton;
