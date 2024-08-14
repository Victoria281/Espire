import React from "react";
import styles from './styles.module.css'

const InformationHeading = ({ title }) => {
    return (
        <p className={styles.informationHeadingTitle} >
            {title}
        </p>
    );
}

export default InformationHeading;
