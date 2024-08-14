import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { HealthCheck, Advertisement, Services, Flow, Action, End } from "../components/HomeComponents";

const HomeScreen = () => {

  return (
    <div className="mainContainer restrictScroll">
      <HealthCheck />
      <Advertisement />
      <Services />
      <Flow />
      <Action />
      <End />
    </div>
  );
};

export default HomeScreen;
