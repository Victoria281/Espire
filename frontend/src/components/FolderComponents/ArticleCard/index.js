// ArticleCard.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from './styles.module.css';

const ArticleCard = ({ article }) => (
    <Box className={styles.articleCard}>
        <img src={article.image} alt={article.title} className={styles.articleImage} />
        <Typography variant="h6">{article.title}</Typography>
        <Typography variant="caption">{article.date}</Typography>
        <Typography variant="body2">{article.description}</Typography>
    </Box>
);

export default ArticleCard;
