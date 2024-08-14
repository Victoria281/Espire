import React from 'react';
import styles from './styles.module.css';
import { useNavigate } from "react-router-dom";
import ArticleCollection from '../../ArticleComponents/ArticleCollection';
import Logo from '../../common/Navbar/Logo';
import { Chip, Typography } from '@mui/material';

const ArticlesSummary = ({ article }) => {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return date.toLocaleDateString('en-GB', options);
    };
    return (
        <div className={styles.mainContainer}>
            <p className={styles.title}>{article.name}</p>
            <p>by {article.authors}</p>
            <p>{formatDate(article.date)}</p>
            <p>{article.use}</p>
            <p>{article.description}</p>
            <div className={styles.tagsDisplayContainer}>
                    {article.Tags != null && article.Tags.length > 0 ? (
                        article.Tags.map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag.name}
                                className={styles.tagChip}
                                sx={{
                                    '& .MuiChip-deleteIcon': {
                                        display: 'none',
                                    },
                                }}
                            />
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No tags available
                        </Typography>
                    )}
                </div>
        </div>
    );
};

export default ArticlesSummary;
