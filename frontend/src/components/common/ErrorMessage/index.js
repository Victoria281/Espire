import React from "react";
import styles from './styles.module.css'

const ErrorMessage = ({ msg }) => {

    return (
        <p className={styles.errMsg}>{msg}</p>
    );
}

export default ErrorMessage;