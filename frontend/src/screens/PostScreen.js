import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";
import { retrieveArticleById } from "../functions/articles";
import { getAllTags, newArticleWorkspace, handleCreateNewArticlePost, handleUpdateNewArticlePost } from "../store/actions/articles";
import { BASIC_INFO, TAG_MANAGEMENT, QUOTE_MANAGEMENT, FLASHCARD_MANAGEMENT } from "../constants/names";
import InformationHeading from "../components/ArticleComponents/InformationHeading";
import BasicInformation from "../components/ArticleComponents/BasicInformation";
import QuoteManagement from "../components/ArticleComponents/QuoteManagement";
import TagManagement from "../components/ArticleComponents/TagManagement";
import PostButton from "../components/ArticleComponents/PostButton";

const PostScreen = () => {
  const { articleid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tags = useSelector(state => state.articles.tags);
  const token = useSelector(state => state.user.token);


  const workspace_article = useSelector(state => state.articles.workspace.article);
  const [editedInfo, setEditedInfo] = useState(workspace_article);
  const [quoteInfo, setQuoteInfo] = useState(workspace_article.Quotes);
  const [tagInfo, setTagInfo] = useState(workspace_article.Tags);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (articleid != undefined) {
      retrieveArticleById(articleid, dispatch);
    } else {
      dispatch(newArticleWorkspace());
    }
  }, [])


  const handlePostClick = (new_article) => {
    let info = editedInfo;
    info.Quotes = quoteInfo;

    console.log(info);

    if (checkWorkspaceInfo(info)) {

      if (new_article == true) {
        console.log("handling create new article");
        dispatch(handleCreateNewArticlePost(info)).then((result) => {
          navigate(`/articles/${result}`)
        });
      } else {
        console.log("handling update  article");
        dispatch(handleUpdateNewArticlePost(info)).then((success) => {
          if (success) navigate(`/articles/${articleid}`)
        });
      }
    }
  }

  const checkWorkspaceInfo = () => {
    let err_msg = "";
    let info = { ...editedInfo, Quotes: quoteInfo, Tags: tagInfo }
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
    } 
    // else if (!isValidDate(info.date)) {
    //   err_msg += "Start date is not in the correct format (YYYY-MM-DD). ";
    //   hasError = true;
    // }

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


  useEffect(() => {
    if (token != undefined) {
      dispatch(getAllTags())
    }
  }, [])

  return (
    <div className="mainContainer restrictScroll">

      {
        editedInfo != {} ?
          <>
            <InformationHeading title={BASIC_INFO} />
            <BasicInformation edit={true} editedInfo={editedInfo} setEditedInfo={setEditedInfo} />

            <InformationHeading title={QUOTE_MANAGEMENT} />
            <QuoteManagement edit={true} quoteInfo={quoteInfo} setQuoteInfo={setQuoteInfo} />

            <InformationHeading title={TAG_MANAGEMENT} />
            <TagManagement edit={true} tags={tags} tagInfo={tagInfo} setTagsInfo={setTagInfo} />

            {/* <InformationHeading title={FLASHCARD_MANAGEMENT}/>
    <FlashcardManagement edit={false} info={workspace.article.Flashcards} /> */}

            <PostButton msg={errMsg} editedInfo={editedInfo} onClick={(item) => handlePostClick(item)} />
          </>

          :
          <p>Please refresh the page if you do not see anything</p>

      }
    </div>

  );
};

export default PostScreen;
