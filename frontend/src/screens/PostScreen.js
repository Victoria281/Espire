import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import BasicInformation from "../components/ArticleComponents/BasicInformation"
import QuoteManagement from "../components/ArticleComponents/QuoteManagement"
import FlashcardManagement from "../components/ArticleComponents/FlashcardManagement"

const PostScreen = () => {


  const data = {
    "id": 1,
    "username": "test",
    "parentusername": null,
    "basic_info": {
      "name": "test2article",
      "use": "test2ing",
      "description": "testing2 Description Description Description Description Description",
      "createdat": "2024-06-01T05:55:47.267406+08:00",
      "updatedat": "2024-06-01T05:55:47.267406+08:00",
      "deletedat": null,
      "Links": [],
    },
    "Quotes": [
      {
        "id": 1,
        "article_id": 1,
        "grp_num": 3,
        "priority": 3,
        "fact": "testing2 fact fact fact fact fact",
        "createdat": "2024-06-01T05:56:25.079664+08:00",
        "updatedat": "2024-06-01T05:56:25.079664+08:00",
        "deletedat": null
      },
      {
        "id": 2,
        "article_id": 1,
        "grp_num": 2,
        "priority": 1,
        "fact": "ds fact fact fact fact fact",
        "createdat": "2024-06-01T05:56:36.339938+08:00",
        "updatedat": "2024-06-01T05:56:36.339938+08:00",
        "deletedat": null
      }
    ],
    "Flashcards": [
      {
        "id": 1,
        "article_id": 1,
        "answer": "This is the answer",
        "question": "what is the answer?",
        "tries": 0,
        "wrong": 0,
        "createdat": "2024-06-01T05:56:46.992933+08:00",
        "updatedat": "2024-06-01T05:56:46.992933+08:00",
        "deletedat": null
      }
    ]
  }

  return (
    <div className="mainContainer restrictScroll">
      <BasicInformation edit={true} info={data.basic_info}/>
      <QuoteManagement edit={true} quotes={data.Quotes}/>
      <FlashcardManagement edit={true} flashcards={data.Flashcards}/>
    </div>
  );
};

export default PostScreen;
