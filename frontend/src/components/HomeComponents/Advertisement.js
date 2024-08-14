import React from "react";
import { LOGO_NOWORDS_IMAGE_PATH, ADVERTISEMENT_HEADING, ADVERTISEMENT_TEXT, ADVERTISEMENT_IMAGE_PATH } from "../../constants/names";

import styles from './styles.module.css'

const Advertisement = () => {
    return (
        <div className={styles.advertisementContainer}>
            <div className={styles.advertisementContainerLeft}>
                <img className={styles.advertisementContainerLeftImg} src={LOGO_NOWORDS_IMAGE_PATH} />
                <p>{ADVERTISEMENT_HEADING}</p>
                <p>{ADVERTISEMENT_TEXT}</p>
            </div>
            <div className={styles.advertisementContainerRight}>
                <img className={styles.advertisementContainerRightImg} src={ADVERTISEMENT_IMAGE_PATH} />
            </div>
        </div>
    );
}

export default Advertisement;
