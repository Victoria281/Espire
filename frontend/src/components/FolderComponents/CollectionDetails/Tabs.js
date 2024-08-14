import React, { useState } from 'react';
import styles from './styles.module.css';

const Tabs = ({ tablist, selectedTab, handleChange }) => {

    return (
        <div className={styles.tabContainer}>
            {tablist.map((tabitem, index) =>
                <div
                    className={`${styles.tab} ${selectedTab === tabitem ? styles.tabActive : ''}`}
                    onClick={() => handleChange(tabitem)}
                >
                    {tabitem}
                </div>
            )}
        </div>
    );
};

export default Tabs;
