import { useEffect, useState } from "react";
import styles from './styles.module.css'
import { useDispatch } from 'react-redux';
import {  useParams } from "react-router-dom";

import Button from "../../common/Button";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CircularProgress, Box, Typography } from '@mui/material';
import { scrapeArticle } from "../../../store/actions/articles"
import WebScrapingEditor from "../WebScrapingEditor"

const WebScrapingTool = ({ handleGoBack, tags }) => {
    const { url } = useParams();

    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [scrapped, setScrapped] = useState(false);
    const [scrappedSuccess, setScrappedSuccess] = useState(true);
    const [info, setInfo] = useState({});

    const dispatch = useDispatch();

    const handleWebScrap = async (urlItem) => {
        setLoading(true);

        let manageLink = link;

        if (link == "") {
            manageLink = urlItem
        }

        await dispatch(scrapeArticle(link)).then(({ success, data }) => {
            if (success) {
                setInfo(data)
                setScrapped(true)
            } else {
                setScrappedSuccess(false)
            }
        })

        setLoading(false);
    }

    useEffect(() => {
        if (url != undefined) {
            setLink(url)
            handleWebScrap(url)
        }
    }, [url]);
    return (
        <div>
            {
                scrappedSuccess ?
                    <>
                        {
                            scrapped ?
                                info != {} && <WebScrapingEditor info={info} tags={tags} />
                                :
                                <>
                                    <div className={styles.linkContainer}>
                                        <div className={styles.backBtn} onClick={() => handleGoBack()} >
                                            <ArrowBackIcon />
                                        </div>
                                        {
                                            loading ?
                                                <div className={styles.loaderContainer}>
                                                    <CircularProgress
                                                        size={60}
                                                        className={styles.loader} />
                                                    <Typography variant="h6" color="textSecondary">
                                                        Scraping details from
                                                    </Typography>
                                                    <p>{link}</p>
                                                </div>
                                                :
                                                <>
                                                    <h1 className={styles.linkTitle}>Enter Link to article</h1>
                                                    <input
                                                        type="text"
                                                        value={link}
                                                        onChange={(e) => setLink(e.target.value)}
                                                        placeholder="Enter Link..."
                                                        className={styles.searchInput}
                                                    />
                                                    <div className={styles.searchBtn}>
                                                        <Button type="main" onClick={() => handleWebScrap()}>
                                                            Start
                                                        </Button>
                                                    </div>
                                                </>
                                        }
                                    </div>
                                </>
                        }
                    </>
                    :
                    <div className={styles.linkContainer}>
                        <div className={styles.backBtn} onClick={() => handleGoBack()} >
                            <ArrowBackIcon />
                        </div>
                        <h1 className={styles.failTitle}>Article not found!</h1>
                    </div>
            }
        </div>
    );
}

export default WebScrapingTool;
