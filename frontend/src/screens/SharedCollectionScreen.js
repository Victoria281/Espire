import React, { useState } from 'react';
import { useSelector } from 'react-redux'
import { useParams } from "react-router-dom";
import CollectionSectioning from '../components/FolderComponents/CollectionSectioning';

const SharedCollectionScreen = () => {
  const { collectionid } = useParams();
  const shared_collections = useSelector(state => state.articles.shared_collections);

  const getCollections = () => {
    return shared_collections.find(c => c.ID === Number(collectionid));
  }

  return (
    <>
      {shared_collections.length != 0 && <CollectionSectioning collection={getCollections()} />}
    </>
  );
};

export default SharedCollectionScreen;