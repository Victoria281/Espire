import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Tabs, Tab, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faPlus, faArrowsAltH, faArrowsAltV } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.css';
import { DndProvider, useDrop, useDrag } from 'react-dnd';  // Import useDrag here
import { HTML5Backend } from 'react-dnd-html5-backend';
import LeftHeader from "../LeftHeader";
import ArticlesList from "../ArticlesList";
import CollectionDetails from "../CollectionDetails";
import ArticlesSummary from "../ArticlesSummary";

const CollectionSectioning = ({ collection }) => {
    const [selectedArticle, setSelectedArticle] = useState(0);

    return (
        <div className={styles.mainContainer}>
            <div className={styles.leftContainer}>
                <div className={styles.returnContainer}>
                    <LeftHeader />
                </div>
                <div className={styles.articlesContainer}>
                    <ArticlesList articles={collection.Articles} selectedArticle={selectedArticle} setSelectedArticle={setSelectedArticle}/>
                </div>
                <div className={styles.overviewContainer}>
                    <ArticlesSummary article={collection.Articles[selectedArticle]}/>
                </div>

            </div>
            <div className={styles.rightContainer}>
                <div className={styles.synthesisContainer}>
                    <CollectionDetails collection={collection} />
                </div>
                <div className={styles.flashcardsContainer}>

                </div>

            </div>

        </div>

    );
};



export default CollectionSectioning;
