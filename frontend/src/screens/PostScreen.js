import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";
import { retrieveArticleById } from "../functions/articles";
import { newArticleWorkspace, handleCreateNewArticlePost, handleUpdateNewArticlePost } from "../store/actions/articles";
import { BASIC_INFO, TAG_MANAGEMENT, QUOTE_MANAGEMENT, FLASHCARD_MANAGEMENT } from "../constants/names";
import InformationHeading from "../components/ArticleComponents/InformationHeading";
import BasicInformation from "../components/ArticleComponents/BasicInformation";
import QuoteManagement from "../components/ArticleComponents/QuoteManagement";
import PostButton from "../components/ArticleComponents/PostButton";

const PostScreen = () => {
  const { articleid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const workspace_article = useSelector(state => state.articles.workspace.article);
  const [editedInfo, setEditedInfo] = useState(workspace_article);
  const [quoteInfo, setQuoteInfo] = useState(workspace_article.Quotes);
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

  const checkWorkspaceInfo = (info) => {
    let err_msg = "";
    let hasError = false;
    if (!info.name || !info.authors || !info.use || !info.description) {
      err_msg += "Fields cannot be empty. ";
      hasError = true;
    }
    const mainLink = info.Links.find(link => link.is_main);
    if (!mainLink || !mainLink.link) {
      err_msg += "Main link cannot be empty. ";
      hasError = true;
    }
    if (info.Quotes.length === 0 || info.Quotes.some(quote => !quote.fact)) {
      err_msg += "Quotes cannot be empty. ";
      hasError = true;
    }
    console.log(err_msg);
    setErrMsg(err_msg);
    if (hasError) return false;
    return true;
  }



  return (
    <div className="mainContainer restrictScroll">

      {
        editedInfo != {} ?
          <>
            <InformationHeading title={BASIC_INFO} />
            <BasicInformation edit={true} editedInfo={editedInfo} setEditedInfo={setEditedInfo} />

            <InformationHeading title={QUOTE_MANAGEMENT} />
            <QuoteManagement edit={true} quoteInfo={quoteInfo} setQuoteInfo={setQuoteInfo} />

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
