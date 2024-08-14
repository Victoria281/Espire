import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import styles from './styles.module.css';

const VisitsSection = ({ visits }) => {


  return (
    <section className={styles.dashboardSection}>
      <Typography variant="h6">Visit History</Typography>
      {
        (!visits || visits.length === 0) ?
          <Typography>No visit history available.</Typography>
          :
          <List>
            {visits.map((visit, index) => (
              <ListItem key={index} className={styles.visitItem}>
                <ListItemText
                  primary={`Article: ${visit.article_name}`}
                  secondary={`Visits: ${visit.visit} | Date: ${new Date(visit.createdat).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
      }
    </section>
  );
};

export default VisitsSection;
