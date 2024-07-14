import React from 'react';
import styles from './styles.module.css';
import { useNavigate } from "react-router-dom";
import ArticleCollection from '../../ArticleComponents/ArticleCollection';
import Logo from '../../common/Navbar/Logo';

const ArticlesList = ({ articles, selectedArticle, setSelectedArticle }) => {

    return (
        <div className={styles.mainContainer}>
            {articles.map((item, index) => (
                <div
                    onClick={() => setSelectedArticle(index)}
                    className={styles[`article${selectedArticle === index ? 'selected' : ''}Container`]}>
                    {item.name}
                </div>
            ))}
        </div>
    );
};

export default ArticlesList;
