import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './styles.module.css'

const ArticleCollection = ({ search, articles }) => {

    const [selectedArticle, setSelectedArticle] = useState(-1);
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return date.toLocaleDateString('en-GB', options);
    };

    const handleShowDescription = (ind) => {
        if (selectedArticle == ind) {
            setSelectedArticle(-1)
        } else {
            setSelectedArticle(ind)
        }
    }

    const handleSelectArticle = (ind) => {
        navigate(`/articles/${articles[ind].id}`);
    }

    return (
        <div className={styles.articleListContainter} >
            <div className={styles.articleListTitle}>
                <p>Date</p>
                <p>Name</p>
                <p>Author</p>
                {search ?
                    <p>User</p>
                    :
                    <p>Saves</p>
                }
            </div>
            {articles != undefined && articles.map((item, index) =>
                <div key={index}>
                    <div key={index} className={styles.articleListItemTitle} onClick={() => handleShowDescription(index)}>
                        <p>{formatDate(item.date)}</p>
                        <p>{item.name}</p>
                        <p>{item.authors}</p>
                        {search ?
                            <p>{item.username}</p>
                            :
                            <p>X saves</p>
                        }
                    </div>
                    {selectedArticle == index ?
                        <div key={index} className={styles.articleListItemDescription} onClick={() => handleSelectArticle(index)}>
                            <p>{item.name}</p>
                            <p>by {item.authors}</p>
                            <p>Published on {formatDate(item.date)}</p>
                            <p>{item.Links != null && item.Links.map((linkItem, ind) => {
                                if (linkItem.is_main) return <p>{linkItem.Link}</p>
                            })}</p>
                            <p>{item.description}</p>
                        </div>
                        :
                        <span></span>
                    }
                </div>
            )}
        </div>
    );
}

export default ArticleCollection;
