import { useEffect, useState } from "react";
import styles from './styles.module.css'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import Button from "../../common/Button";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { handleCreateNewArticlePost } from "../../../store/actions/articles"
import QuoteManagement from '../../ArticleComponents/QuoteManagement';
import TagManagement from '../../ArticleComponents/TagManagement';
import TagManager from '.';
import { TextField, Box, Typography, Container, Divider } from '@mui/material'; 

const WebScrapingEditor = ({ info, tags }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [articleData, setArticleData] = useState({
        name: info.article.name,
        authors: info.article.authors,
        date: new Date(info.article.date).toLocaleDateString(),
        description: info.article.description,
        use: "",
        Links: info.article.Links,
    });
    const [quotes, setQuotes] = useState([]);
    const [ntags, setnTags] = useState(info.article.Tags);
    const [content] = useState(info.article.use);
    const [selectedText, setSelectedText] = useState('');
    const [errMsg, setErrMsg] = useState("");

    const handleSelectText = () => {
        setQuotes([...quotes, {
            grp_num: 1,
            priority: 1,
            fact: selectedText
        }]);
    }

    const handleTextSelection = () => {
        const selection = window.getSelection();
        setSelectedText(selection.toString());
    };


    const checkWorkspaceInfo = () => {
        let err_msg = "";
        let info = { ...articleData, Quotes: quotes, Tags: ntags }
        let hasError = false;

        if (!info.name) {
            err_msg += "Name cannot be empty. ";
            hasError = true;
        }
        if (!info.authors) {
            err_msg += "Authors cannot be empty. ";
            hasError = true;
        }
        if (!info.use) {
            err_msg += "Use cannot be empty. ";
            hasError = true;
        }
        if (!info.description) {
            err_msg += "Description cannot be empty. ";
            hasError = true;
        }

        const mainLink = info.Links.find(link => link.is_main);
        if (!mainLink) {
            err_msg += "Main link is missing. ";
            hasError = true;
        } else if (!mainLink.link) {
            err_msg += "Main link cannot be empty. ";
            hasError = true;
        }

        if (info.Quotes.length === 0) {
            err_msg += "At least one quote is required. ";
            hasError = true;
        } else if (info.Quotes.some(quote => !quote.fact)) {
            err_msg += "Quotes cannot have empty facts. ";
            hasError = true;
        }

        if (!info.date) {
            err_msg += "Start date cannot be empty. ";
            hasError = true;
        } else if (!isValidDate(info.date)) {
            err_msg += "Start date is not in the correct format (YYYY-MM-DD). ";
            hasError = true;
        }

        if (err_msg == "") {
            err_msg = "Ready to create!";
        }

        setErrMsg(err_msg);
        return !hasError;
    }

    const isValidDate = (dateString) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) {
            return false;
        }

        const date = new Date(dateString);
        const [year, month, day] = dateString.split('-').map(Number);

        return (
            date.getFullYear() === year &&
            date.getMonth() + 1 === month &&
            date.getDate() === day
        );
    };

    const handleCreateArticle = () => {
        let info = { ...articleData, Quotes: quotes, Tags: ntags };
        console.log(info);

        if (checkWorkspaceInfo(info)) {
            console.log("handling create new article");
            dispatch(handleCreateNewArticlePost(info)).then((result) => {
                navigate(`/articles/${result}`)
            });
        }
    };

    return (
        <div className={styles.container}>

            <div className={styles.leftContainer}>
                <h1 className={styles.scrapeTitle}>Scrapped Contents</h1>
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={articleData.name}
                    onChange={(e) => setArticleData({ ...articleData, name: e.target.value })}
                />
                <TextField
                    label="Author"
                    variant="outlined"
                    fullWidth
                    value={articleData.authors}
                    onChange={(e) => setArticleData({ ...articleData, authors: e.target.value })}
                />
                <TextField
                    label="Date Published"
                    variant="outlined"
                    fullWidth
                    type="date"
                    value={articleData.date}
                    onChange={(e) => setArticleData({ ...articleData, date: e.target.value })}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Use"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={1}
                    value={articleData.use}
                    onChange={(e) => setArticleData({ ...articleData, use: e.target.value })}
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={articleData.description}
                    onChange={(e) => setArticleData({ ...articleData, description: e.target.value })}
                />

                <div className={styles.divider}></div>

                <h1 className={styles.scrapeTitle}>Contents of article</h1>
                <p className={styles.guideInfo}> Before pressing the "Set as Quote" button, select the text you wish to create as quote</p>

                <p
                    className={styles.content}
                    onMouseUp={handleTextSelection}
                >
                    {content}
                </p>

                <div className={styles.QuoteBtn}>
                    <Button type="main" onClick={() => handleSelectText()}>
                        Set as Quote
                    </Button>
                </div>
            </div>
            <div className={styles.rightContainer}>
                <div className={styles.rightTopContainer}>
                    <h1 className={styles.scrapeTitle}>Created Quotes</h1>
                    <div className={styles.quoteContainer}>
                        <QuoteManagement edit={true} quoteInfo={quotes} setQuoteInfo={setQuotes} />
                    </div>
                </div>
                <div className={styles.divider}></div>

                <div className={styles.rightBottomContainer}>
                    <h1 className={styles.scrapeTitle}>Created Tags</h1>
                    <div className={styles.tagContainer}>
                        <TagManagement edit={true} tags={tags} tagInfo={ntags} setTagsInfo={setnTags} />
                    </div>

                </div>
                <div className={styles.divider}></div>
                <div className={styles.saveContainer}>
                    <div className={styles.saveContainerBtns}>
                        <Button type="main" onClick={() => checkWorkspaceInfo()}>
                            Check
                        </Button>
                        <Button type="main" onClick={() => handleCreateArticle()}>
                            Create
                        </Button>
                    </div>
                    <p className={styles.errGuideInfo}>{errMsg}</p>

                </div>

            </div>


            {/* <Box className={styles.formContainer}>
          
  
        <Divider sx={{ my: 4 }} />
  
        <TagManager
          tags={tags}
          existingTags={articleData.Tags.map(tag => tag.name)}
          newTag={newTag}
          setNewTag={setNewTag}
          onTagAdd={handleTagAdd}
          onTagRemove={handleTagRemove}
        />
  
        <Box className={styles.submitContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ borderRadius: 2, px: 4, py: 1.5 }}
          >
            Submit
          </Button>
        </Box> */}
        </div>
    );
};
export default WebScrapingEditor;
