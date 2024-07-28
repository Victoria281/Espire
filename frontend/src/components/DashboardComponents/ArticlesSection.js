import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const ArticlesSection = ({ articles }) => {
  const navigate = useNavigate();

  const handleClick = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  return (
    <section className={styles.dashboardSection}>
      <Typography variant="h6">Saved Articles</Typography>
      {
        (!articles || articles.length === 0) ?
          <Typography>No saved articles available.</Typography>
          :
          <List>
            {articles.map((article) => (
              <ListItem
                key={article.id}
                className={styles.articleItem}
                button
                onClick={() => handleClick(article.id)}
              >
                <ListItemText
                  primary={article.name}
                  secondary={`Created By: ${article.username} | Author: ${article.authors} | Use: ${article.use} | Date: ${new Date(article.date).toLocaleDateString()}`}
                />
                <Typography variant="body2">{article.description}</Typography>
              </ListItem>
            ))}
          </List>
      }
    </section>
  );
};

export default ArticlesSection;
