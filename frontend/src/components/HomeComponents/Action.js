import React from "react";
import { ACTION_TEXT } from "../../constants/names";
import { Link } from "react-router-dom";
import styles from './styles.module.css'

const Action = () => {
    return (
        <div className={styles.actionContainer} >
            <Link to={"/register"} className={styles.actionContainerBtn}>
                {ACTION_TEXT}
            </Link>
        </div>
    );
}

export default Action;
