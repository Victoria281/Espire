import React from "react";
import { Link } from "react-router-dom";
import styles from './styles.module.css'
import { SERVICES_HEADING_TOP, SERVICES_HEADING, SERVICES_ITEMS } from "../../constants/names";

const Services = () => {
    return (
        <div className={styles.servicesContainer}>
            <p>{SERVICES_HEADING_TOP}</p>
            <p>{SERVICES_HEADING}</p>
            <div className={styles.servicesItemsMainContainer}>
                {SERVICES_ITEMS.map((item, index) =>
                    <div key={index} className={styles.servicesItemsContainer}>
                        <p>{item.name}</p>
                        <ul>
                            {item.lst.map((lstItems, lstInd) =>
                                <li key={lstInd}>{lstItems}</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
export default Services;
