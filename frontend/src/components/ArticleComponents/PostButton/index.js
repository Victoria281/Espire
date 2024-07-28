import React from "react";
import { TAB1, TAB2 } from "../../../constants/names"
import styles from './styles.module.css'
import Button from "../../common/Button";
import ErrorMessage from "../../common/ErrorMessage";
import { useLocation } from "react-router-dom";

const PostButton = ({ msg, onClick, checkInput }) => {

    const location = useLocation();

    const isEditing = () => {
        return location.pathname.split('/').length >= 3
    }

    return (
        <div className={styles.postButtonContainer}>
            <ErrorMessage msg={msg} />

            <div className={styles.btns}>
                <Button type="main" onClick={() => checkInput()}>
                    Check
                </Button>
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
        </div>

    );
}

export default PostButton;
