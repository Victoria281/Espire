import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Box, Typography } from '@mui/material';
import ArticleCard from '../components/FolderComponents/ArticleCard'; // Import your ArticleCard component
import styles from '../components/FolderComponents/CollectionDetails/styles.module.css';
import { mockCollection } from '../constants/names';
import CollectionDetails from '../components/FolderComponents/CollectionDetails';

const CollectionScreen = ({ collection }) => {
  const [articles, setArticles] = useState(mockCollection.Articles);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'ARTICLE',
    drop: (item) => handleDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleDrop = (item) => {
    // Logic to handle the drop event
    console.log(item);
  };

  return (
    <CollectionDetails collection={mockCollection} />
  );
};

export default CollectionScreen;