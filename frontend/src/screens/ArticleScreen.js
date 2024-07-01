import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";
import { retrieveArticleById } from "../functions/articles";
import { getAllTags } from "../store/actions/articles";
import { BASIC_INFO, TAG_MANAGEMENT, QUOTE_MANAGEMENT, FLASHCARD_MANAGEMENT } from "../constants/names";
import InformationHeading from "../components/ArticleComponents/InformationHeading";
import BasicInformation from "../components/ArticleComponents/BasicInformation";
import QuoteManagement from "../components/ArticleComponents/QuoteManagement";
import TagManagement from "../components/ArticleComponents/TagManagement";
import FlashcardManagement from "../components/ArticleComponents/FlashcardManagement";

const ArticleScreen = () => {
  const { articleid } = useParams();
  const [articleView, setArticleView] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const token = useSelector(state => state.user.token);
  const workspace = useSelector(state => state.articles.workspace);
  const tags = useSelector(state => state.articles.tags);

  const [flashcards, setFlashcards] = useState(workspace.article.Flashcards);
  const switchTabs = () => {
    setArticleView(!articleView);
  }

  useEffect(() => {
    if (token != undefined) {
      retrieveArticleById(articleid, dispatch);
      dispatch(getAllTags())
    }
  }, [])

  console.log(workspace)

  return (
    <div className="mainContainer restrictScroll">

      <InformationHeading title={BASIC_INFO} />
      <BasicInformation edit={false} editedInfo={workspace.article} />

      <InformationHeading title={TAG_MANAGEMENT} />
      {tags!=undefined && <TagManagement edit={false} tags={tags} tagInfo={workspace.article.Tags} />}

      <InformationHeading title={QUOTE_MANAGEMENT} />
      <QuoteManagement edit={false} quoteInfo={workspace.article.Quotes} />

      {/* <InformationHeading title={FLASHCARD_MANAGEMENT} />
      <FlashcardManagement flashcards={flashcards} setFlashcards={setFlashcards}/> */}
    </div>
  );
};

export default ArticleScreen;
