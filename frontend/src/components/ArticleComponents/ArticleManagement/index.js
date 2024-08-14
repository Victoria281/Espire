import React, { useState } from 'react';
import DeleteArticleModal from './DeleteArticleModal.js';
import styles from './styles.module.css';
import { useDispatch } from 'react-redux';
import { deleteArticlesByIdAPI } from '../../../controller/articleController';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const ArticleManagement = ({ articleId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrMsg('');
  };


  const handleDeleteArticle = () => {
    setLoading(true);
    deleteArticlesByIdAPI(articleId) 
      .then(({ success, error }) => {
        setLoading(false);
        if (success) {
          navigate('/library')
        } else {
          setErrMsg(error);
        }
      });
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div>
      <button onClick={handleOpenModal} className={styles.iconButton}>
        <DeleteIcon />
      </button>
      <DeleteArticleModal
        errmsg={errMsg}
        setErrMsg={setErrMsg}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDeleteArticle}
      />
    </div>
  );
};

export default ArticleManagement;
