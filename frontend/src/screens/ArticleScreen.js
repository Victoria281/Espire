import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams  } from "react-router-dom";
import { retrieveArticleById } from "../functions/articles";
import { BASIC_INFO, TAG_MANAGEMENT, QUOTE_MANAGEMENT, FLASHCARD_MANAGEMENT } from "../constants/names";
import InformationHeading from "../components/ArticleComponents/InformationHeading";
import BasicInformation from "../components/ArticleComponents/BasicInformation";
import QuoteManagement from "../components/ArticleComponents/QuoteManagement";
import FlashcardManagement from "../components/ArticleComponents/FlashcardManagement";

const ArticleScreen = () => {
  const { articleid } = useParams();
  const [articleView, setArticleView] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector(state => state.user.token);
  const workspace = useSelector(state => state.articles.workspace);

  const switchTabs = () => {
    setArticleView(!articleView);
  }

  useEffect(() => {
    if (token != undefined) {
      retrieveArticleById(articleid, dispatch);
    }
  }, [])

  console.log(workspace)

  return (
    <div className="mainContainer restrictScroll">

    <InformationHeading title={BASIC_INFO}/>
    <BasicInformation edit={false} editedInfo={workspace.article} />

    <InformationHeading title={QUOTE_MANAGEMENT}/>
    <QuoteManagement edit={false} quoteInfo={workspace.article.Quotes} />

    {/* <InformationHeading title={FLASHCARD_MANAGEMENT}/>
    <FlashcardManagement edit={false} info={workspace.article.Flashcards} /> */}
    </div>
  );
};

export default ArticleScreen;
