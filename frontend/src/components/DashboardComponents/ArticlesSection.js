import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './styles.module.css'; // Import CSS module

const ArticlesSection = ({ articles }) => {
  const navigate = useNavigate(); // Initialize navigate

  if (!articles || articles.length === 0) {
    return <Typography>No saved articles available.</Typography>;
  }

  const handleClick = (articleId) => {
    navigate(`/articles/${articleId}`); // Navigate to the article's detail page
  };

  return (
    <section className={styles.dashboardSection}>
      <Typography variant="h6">Saved Articles</Typography>
      <List>
        {articles.map((article) => (
          <ListItem 
            key={article.id} 
            className={styles.articleItem} 
            button 
            onClick={() => handleClick(article.id)} // Handle click event
          >
            <ListItemText
              primary={article.name}
              secondary={`Created By: ${article.username} | Author: ${article.authors} | Use: ${article.use} | Date: ${new Date(article.date).toLocaleDateString()}`}
            />
            <Typography variant="body2">{article.description}</Typography>
          </ListItem>
        ))}
      </List>
    </section>
  );
};

export default ArticlesSection;
