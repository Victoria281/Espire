import React, { useState } from 'react';
import { useSelector } from 'react-redux'
import { useParams } from "react-router-dom";
import CollectionSectioning from '../components/FolderComponents/CollectionSectioning';

const CollectionScreen = () => {
  const { collectionid } = useParams();
  const collections = useSelector(state => state.articles.collections);

  const getCollections = () => {
    return collections.find(c => c.ID === Number(collectionid));
  }

  return (
    <>
      {collections.length != 0 && <CollectionSectioning collection={getCollections()} />}
    </>
  );
};

export default CollectionScreen;