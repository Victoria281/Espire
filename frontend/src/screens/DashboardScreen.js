import React, { useEffect, useState } from "react";
import { retrieveOwnInfo } from "../functions/dashboard";
import styles from '../components/DashboardComponents/styles.module.css'; // Import CSS module

import { VisitsSection, TagsSection, ArticlesSection } from '../components/DashboardComponents/index';

const DashboardScreen = () => {
  const [userVisits, setUserVisits] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await retrieveOwnInfo();
        if (result.success) {
          setUserVisits(result.visits || []); // Ensure default empty array
          setUserTags(result.tags || []); // Ensure default empty array
          setSavedArticles(result.savedArticles || []); // Ensure default empty array
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1>User Dashboard</h1>
      {userVisits.length >= 0 && <VisitsSection visits={userVisits} />}
      {userTags.length >= 0 && <TagsSection tags={userTags} setTags={setUserTags} />}
      {savedArticles.length >= 0 && <ArticlesSection articles={savedArticles} />}
      {userVisits.length === 0 && userTags.length === 0 && savedArticles.length === 0 && (
        <div className={styles.noData}>No data available.</div>
      )}
    </div>
  );
};

export default DashboardScreen;