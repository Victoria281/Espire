import React from "react";
import { TAB1, TAB2 } from "../../../constants/names"
import styles from './styles.module.css'

const TabSelection = ({ articleView, setArticleView }) => {
    return (
        <div className={styles.tabContainer} >
            <div className={styles[`tabItem${articleView ? '-selected' : ''}`]}  onClick={() => !articleView && setArticleView(true)}>
                <p>{TAB1}</p>
            </div>
            <span></span>
            <div className={styles[`tabItem${articleView ? '' : '-selected'}`]}  onClick={() => articleView && setArticleView(false)}>
                <p>{TAB2}</p>
            </div>
        </div>

    );
}

export default TabSelection;
