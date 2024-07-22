import React from 'react';
import PullToRefresh from 'react-pull-to-refresh';
import styles from './styles.module.css';

const RecommendedList = ({ reccomendationList, handleRetrieveReccomendations, handleClickArticle }) => {
    return (
        <PullToRefresh onRefresh={handleRetrieveReccomendations}>
            <div className={styles.recommendedList}>
                {reccomendationList.map((article) => (
                    <div key={article.id} className={styles.articleCard} onClick={()=>handleClickArticle(article.id)}>
                        <h2 className={styles.articleTitle}>{article.name}</h2>
                        <p className={styles.articleDescription}>{article.description}</p>
                        <div className={styles.articleMeta}>
                            <span className={styles.articleAuthors}>{article.authors}</span>
                            <span className={styles.articleDate}>{new Date(article.date).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.articleTags}>
                            {article.Tags.map((tag) => (
                                <span key={tag.ID} className={styles.articleTag}>{tag.name}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </PullToRefresh>
    );
};

export default RecommendedList;
