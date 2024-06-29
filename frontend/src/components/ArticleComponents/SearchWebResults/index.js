import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../common/Button";

import styles from './styles.module.css'

const SearchWebResults = ({ web_results }) => {

    const [selectedArticle, setSelectedArticle] = useState(-1);
    const navigate = useNavigate();

    const handleShowDescription = (ind) => {
        if (selectedArticle == ind) {
            setSelectedArticle(-1)
        } else {
            setSelectedArticle(ind)
        }
    }

    const handleSelectWebResult = (item) => {

    }


    return (
        <div className={styles.articleListContainter} >
            <div className={styles.articleListTitle}>
                <p>Date</p>
                <p>Name</p>
                <p>Author</p>
            </div>
            {web_results != undefined && web_results.map((item, index) =>
                <div key={index}>
                    <div key={index} className={styles.articleListItemTitle} onClick={() => handleShowDescription(index)}>
                        <p>{item.date}</p>
                        <p>{item.title}</p>
                        <p>{item.authors}</p>
                    </div>
                    {selectedArticle == index ?
                        <div key={index} className={styles.articleListItemDescription}>
                            <p>{item.title}</p>
                            <p>by {item.authors}</p>
                            <p>Published on {item.date}</p>
                            <a href={item.link}>{item.link}</a>
                            <p>{item.description}</p>
                            <div className={styles.createPostButton}>
                            <Button type="main" onClick={() => handleSelectWebResult(item)}>
                                Create article on this post
                            </Button>
                        </div>
                        </div>
                        :
                        <span></span>
                    }
                </div>
            )}
        </div>
    );
}

export default SearchWebResults;
