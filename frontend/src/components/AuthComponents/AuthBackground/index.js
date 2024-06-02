import React from "react";
import styles from './styles.module.css'

const AuthBackground = ({ children }) => {
    return (
        <div className={styles.authBackgroundContainer} >
            <div className={styles.authBackgroundItem} >
                {children}
            </div>
        </div>
    );
}

export default AuthBackground;
