import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'

const RegisterScreen = () => {

  return (
    <div className="mainContainer restrictScroll">
      <div className="authContainer">
        <div className="sideContainer">
          <p>Welcome Back!</p>
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

export default RegisterScreen;
