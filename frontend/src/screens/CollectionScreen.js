import React, { useState } from 'react';
import { useSelector } from 'react-redux'
import { useParams } from "react-router-dom";
import CollectionDetails from '../components/FolderComponents/CollectionDetails';

const CollectionScreen = () => {
  const { collectionid } = useParams();
  const collections = useSelector(state => state.articles.collections);

  const getCollections = () => {
    return collections.find(c => c.ID === Number(collectionid));
  }

  return (
    <>
      {collections.length != 0 && <CollectionDetails collection={getCollections()} />}
    </>
  );
};

export default CollectionScreen;