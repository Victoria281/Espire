import React, { useEffect, useState } from "react";
import { retrieveOwnInfo } from "../functions/dashboard";
import styles from '../components/DashboardComponents/styles.module.css';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";

import { deleteUserAPI } from "../controller/userController";
import { getAllTags } from "../store/actions/articles";
import { logout } from "../functions/auth";

import { VisitsSection, TagsSection, ArticlesSection, UpdatePasswordModal, DeleteUserModal, ProfileActions } from '../components/DashboardComponents/index';

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.user.token);
  const navigate = useNavigate();
  
  const [errmsg, setErrMsg] = useState('');
  const [userVisits, setUserVisits] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdatePasswordOpen, setUpdatePasswordOpen] = useState(false);
  const [isDeleteUserOpen, setDeleteUserOpen] = useState(false);

  const fetchData = async () => {
    try {
      const result = await retrieveOwnInfo();
      if (result.success) {
        setUserVisits(result.visits || []);
        setUserTags(result.tags || []);
        setSavedArticles(result.savedArticles || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token !== undefined) {
      dispatch(getAllTags());
      fetchData();
    } else {
      logout(dispatch, navigate);
    }
  }, [token, dispatch, navigate]);

  const handleDeleteUser = () => {
    setLoading(true);
    deleteUserAPI() 
      .then(({ success, error }) => {
        setLoading(false);
        if (success) {
          logout(dispatch, navigate);
          navigate('/')
        } else {
          setErrMsg(error);
        }
      });
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className="mainContainer restrictScroll">
      <div className={styles.dashboardContainer}>
        <ProfileActions
          onUpdatePassword={() => setUpdatePasswordOpen(true)}
          onDeleteAccount={() => setDeleteUserOpen(true)}
        />
        {userVisits.length >= 0 && <VisitsSection visits={userVisits} />}
        {userTags.length >= 0 && <TagsSection utags={userTags} setUTags={setUserTags} />}
        {savedArticles.length >= 0 && <ArticlesSection articles={savedArticles} />}

        <UpdatePasswordModal isOpen={isUpdatePasswordOpen} onClose={() => setUpdatePasswordOpen(false)} />
        <DeleteUserModal errmsg={errmsg} setErrMsg={setErrMsg} isOpen={isDeleteUserOpen} onClose={() => setDeleteUserOpen(false)} onConfirm={handleDeleteUser} />
      </div>
    </div>
  );
};

export default DashboardScreen;
