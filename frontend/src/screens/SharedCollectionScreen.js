import React, { useState } from 'react';
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";
import CollectionSectioning from '../components/FolderComponents/CollectionSectioning';

const SharedCollectionScreen = () => {
  const { collectionid } = useParams();
  const shared_collections = useSelector(state => state.articles.shared_collections);
const navigate = useNavigate();

  const getCollections = () => {
    if (shared_collections.length == 0) {
      navigate('/library')
    }
    const id = shared_collections.find(c => c.ID === Number(collectionid));
    if (id == undefined) {
      navigate('/library')
    } else {
      return id
    }
  }

  return (
    <>
      {getCollections() !=undefined && <CollectionSectioning collection={getCollections()} owner={false}/>}
    </>
  );
};

export default SharedCollectionScreen;