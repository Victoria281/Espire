import React, { useState } from 'react';
import { Box, Typography, Button, Tabs, Tab, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faPlus, faArrowsAltH, faArrowsAltV } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.css';
import { DndProvider } from 'react-dnd'; 
import { HTML5Backend } from 'react-dnd-html5-backend';
import LeftHeader from "../LeftHeader";
import ArticlesList from "../ArticlesList";
import CollectionDetails from "../CollectionDetails";
import ArticlesSummary from "../ArticlesSummary";
import { useNavigate } from 'react-router-dom';

const CollectionSectioning = ({ collection, owner }) => {
    const [selectedArticle, setSelectedArticle] = useState(0);

    const navigate = useNavigate();

    return (
        <div className={styles.mainContainer}>
            <div className={styles.leftContainer}>
                <div className={styles.returnContainer}>
                    <LeftHeader collectionID={collection.ID}  owner={owner}/>
                </div>

                {collection.Articles.length > 0 ? (
                    <>
                        <div className={styles.articlesContainer}>
                            <ArticlesList 
                                articles={collection.Articles} 
                                selectedArticle={selectedArticle} 
                                setSelectedArticle={setSelectedArticle} 
                            />
                        </div>
                        <div className={styles.overviewContainer}>
                            <ArticlesSummary article={collection.Articles[selectedArticle]} />
                        </div>
                    </>
                ) : (
                    <div className={styles.noArticlesContainer}>
                        <Typography variant="h6">No articles available</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            className={styles.addArticleButton}
                            onClick={() => navigate('/post')}
                        >
                            Add Article
                        </Button>
                    </div>
                )}
            </div>

            <div className={styles.rightContainer}>
                <div className={styles.synthesisContainer}>
                    <CollectionDetails collection={collection} owner={owner}/>
                </div>
            </div>
        </div>
    );
};

export default CollectionSectioning;
