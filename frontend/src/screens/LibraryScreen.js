import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";

const LibraryScreen = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.isLoggedIn()) {
      retrieveProjectList(dispatch);
      const intervalId = setInterval(() => {
        retrieveProjectList(dispatch)
      }, 300000)

      return () => clearInterval(intervalId);
    }
  }, [])

  return (
    <div className="mainContainer restrictScroll">
      <div className="authContainer">
        <div className="sideContainer">
          <p>LibraryScreen</p>
          <div>
            <a>Sign In</a>
          </div>
        </div>
        <div className="mainContainer">
          <p>Register</p>
          <input name="myUsername" placeholder="Username" />
          <input name="myEmail" placeholder="Email" />
          <input name="myPassword" type="password" placeholder="Password" />
        </div>
      </div>
    </div>
  );
};

export default LibraryScreen;
