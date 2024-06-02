import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'

const HomeScreen = () => {

  return (
    <div className="mainContainer restrictScroll">
      <p>Home</p>
      <a href="/login">Login</a>
      <p>d</p>
      <a href="/register">Register</a>
    </div>
  );
};

export default HomeScreen;
