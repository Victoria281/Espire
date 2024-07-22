import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import styles from './styles.module.css'; // Import CSS module

const VisitsSection = ({ visits }) => {
  if (!visits || visits.length === 0) {
    return <Typography>No visit history available.</Typography>;
  }

  return (
    <section className={styles.dashboardSection}>
      <Typography variant="h6">Visit History</Typography>
      <List>
        {visits.map((visit, index) => (
          <ListItem key={index} className={styles.visitItem}>
            <ListItemText
              primary={`Article ID: ${visit.article_id}`}
              secondary={`Visits: ${visit.visit} | Date: ${new Date(visit.createdat).toLocaleString()}`}
            />
          </ListItem>
        ))}
      </List>
    </section>
  );
};

export default VisitsSection;
