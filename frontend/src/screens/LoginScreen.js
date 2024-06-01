import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import AuthBackground from "../components/AuthComponents/AuthBackground"
import AuthMainBar from "../components/AuthComponents/AuthMainBar"
import AuthSideBar from "../components/AuthComponents/AuthSideBar"
import InputComponent from "../components/AuthComponents/InputComponent"
import { useNavigate } from "react-router-dom";
import { SIGNIN, LOGIN, REGISTER_PATHNAME, LOGIN_SIDEBAR_TITLE, SIGNUP } from "../constants/names";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    navigate(REGISTER_PATHNAME)
  }
  const handleLogin = () => {
  }

  return (
    <AuthBackground reverse={false}>
      <AuthMainBar
        btn={SIGNIN} title={LOGIN} onClick={handleLogin}>
        <InputComponent
          title="Username"
          col={username}
          setCol={setUsername}
        />
        <InputComponent
          title="Password"
          col={password}
          setCol={setPassword}
        />
      </AuthMainBar>
      <AuthSideBar
        onClick={() => { handleSignUp() }}
        title={LOGIN_SIDEBAR_TITLE}
        btn={SIGNUP} />
    </AuthBackground>
  );
};

export default LoginScreen;
