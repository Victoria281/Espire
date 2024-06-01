import React from "react";
import { END_COMPANY_NAME, END_COMPANY_DESCRIPTION, END_CONTACT_US_HEAD, END_CONTACT_US_PHONE, END_CONTACT_US_EMAIL, END_CONTACT_US_ADDRESS1, END_CONTACT_US_ADDRESS2 } from "../../constants/names";
import styles from './styles.module.css'

const End = () => {
    return (
        <div className={styles.endContainer} >
            <div className={styles.endContainerLeft}>
                <p>{END_COMPANY_NAME}</p>
                <p>{END_COMPANY_DESCRIPTION}</p>
            </div>
            <div className={styles.endContainerRight}>
                <div>
                    <p>{END_CONTACT_US_HEAD}</p>
                    <p>{END_CONTACT_US_PHONE}</p>
                    <p>{END_CONTACT_US_EMAIL}</p>
                </div>
                <div>
                    <p>{END_CONTACT_US_ADDRESS1}</p>
                    <p>{END_CONTACT_US_ADDRESS2}</p>
                </div>
            </div>
        </div>
    );
}
export default End;
