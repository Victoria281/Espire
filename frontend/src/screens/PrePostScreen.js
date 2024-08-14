import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";
import PostOptions from "../components/PostComponents/PostOptions";
import ForkOptions from "../components/PostComponents/ForkOptions";
import WebScrapingTool from "../components/PostComponents/WebScrapingTool";
import { getAllTags } from "../store/actions/articles";
import { navigateToLogin } from "../functions/authFunctions";


const PrePostScreen = () => {
  const { url } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [webscrap, setWebScrap] = useState(false);


  const handleManualUpload = () => {
    navigate('/manpost')
  }

  const token = useSelector(state => state.user.token);
  const tags = useSelector(state => state.articles.tags);

  useEffect(() => {
    if (token != undefined) {
      dispatch(getAllTags())
      if (url != undefined) {
        setWebScrap(true)
      }
    } else {
      navigateToLogin(navigate);
    }
  }, []);
  return (
    <div className="mainContainer restrictScroll">

      {
        webscrap ?
          <>
            <WebScrapingTool handleGoBack={() => { setWebScrap(false) }} tags={tags} />
          </>
          :
          <>
            <PostOptions handleManualUpload={handleManualUpload} handleEnterLink={() => { setWebScrap(true) }} />
            <ForkOptions />
          </>
      }



    </div>

  );
};

export default PrePostScreen;
