import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import AuthBackground from "../components/AuthComponents/AuthBackground"
import AuthMainBar from "../components/AuthComponents/AuthMainBar"
import AuthSideBar from "../components/AuthComponents/AuthSideBar"
import ErrorMessage from "../components/common/ErrorMessage"
import InputComponent from "../components/AuthComponents/InputComponent"
import { useNavigate } from "react-router-dom";
import { SIGNIN, REGISTER, LOGIN_PATHNAME, REGISTER_SIDEBAR_TITLE, SIGNUP } from "../constants/names";
import { handleRegisterUser } from "../store/actions/user";

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const dispatch = useDispatch();

  const handleSignIn = () => {
    navigate(LOGIN_PATHNAME)
  }
  const handleRegisterCheck = () => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (username.length < 8) {
      setErrMsg("Username must be longer than 8 characters");
    }
    else if (!passwordRegex.test(password)) {
      setErrMsg("Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one number");
    }
    else if (!emailRegex.test(email)) {
      setErrMsg("Invalid email address");
    }
    else {
      handleRegister(username, email, password);
    }
  }

  const handleRegister = (username, email, password) => {
    dispatch(handleRegisterUser(username, email, password)).then(({ success, error }) => {
      if (success) {
        navigate('/library')
      } else {
        setErrMsg(error);
      }
    })
  }

  return (
    <AuthBackground reverse={false}>
      <AuthSideBar
        onClick={() => { handleSignIn() }}
        title={REGISTER_SIDEBAR_TITLE}
        btn={SIGNIN} />
      <AuthMainBar
        btn={SIGNUP} title={REGISTER} onClick={handleRegisterCheck}>
        <InputComponent
          title="Username"
          col={username}
          setCol={setUsername}
        />
        <InputComponent
          title="Email"
          col={email}
          setCol={setEmail}
        />
        <InputComponent
          title="Password"
          col={password}
          setCol={setPassword}
        />
        <ErrorMessage msg={errMsg} />
      </AuthMainBar>
    </AuthBackground>
  );
};

export default RegisterScreen;
