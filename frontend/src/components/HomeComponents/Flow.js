import React from "react";
import { FLOW_ITEMS } from "../../constants/names";
import styles from './styles.module.css'

const Flow = () => {
    return (
        <div className={styles.flowContainer} >
            {FLOW_ITEMS.map((item, index) =>
                <div key={index} className={styles.flowItemsContainer}>
                    <div className={styles.flowItemsContainerLeft}>
                        <p>{item.name}</p>
                        <p>{item.description}</p>
                        <div className={styles.slanted}></div>
                    </div>
                    <img className={styles.flowItemsContainerRight} src={item.img} />
                </div>
            )}
        </div>
    );
}
export default Flow;
