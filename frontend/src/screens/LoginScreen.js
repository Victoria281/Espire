import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'

const LoginScreen = () => {

  return (
    <div className="mainContainer restrictScroll">
      <div className="authContainer">
        <div className="mainContainer">
          <p>Login</p>
          <input name="myUsername" placeholder="Username" />
          <input name="myPassword" type="password" placeholder="Password" />
          <div>
            <a>SIGN IN</a>
          </div>
        </div>
        <div className="sideContainer">
          <p>Don’t have an account?</p>
          <div>
            <a>SIGN UP</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
