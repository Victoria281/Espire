import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import AuthBackground from "../components/AuthComponents/AuthBackground"
import AuthMainBar from "../components/AuthComponents/AuthMainBar"
import AuthSideBar from "../components/AuthComponents/AuthSideBar"
import ErrorMessage from "../components/common/ErrorMessage"
import InputComponent from "../components/AuthComponents/InputComponent"
import { useNavigate } from "react-router-dom";
import { handleLoginUser } from "../store/actions/user";
import { SIGNIN, LOGIN, REGISTER_PATHNAME, LOGIN_SIDEBAR_TITLE, SIGNUP } from "../constants/names";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const dispatch = useDispatch();

  const handleSignUp = () => {
    navigate(REGISTER_PATHNAME)
  }
  const handleLogin = () => {
    setLoading(true)
    dispatch(handleLoginUser(username, password)).then(({ success, error }) => {
      if (success) {
        setLoading(false)
        navigate('/library')
      } else {
        setLoading(false)
        if (error === "refused") {
          setErrMsg("Due to the limitations of our current database, our backend is still inactive, please wait for 50 seconds before trying again! OR test the backend at this link https://espire-backend.onrender.com/espire");
        } else {
          setErrMsg(error);
        }
      }
    })
  }

  return (
    <AuthBackground reverse={false}>
      <AuthMainBar
        loading={loading}
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
        <ErrorMessage msg={errMsg} />
      </AuthMainBar>
      <AuthSideBar
        onClick={() => { handleSignUp() }}
        title={LOGIN_SIDEBAR_TITLE}
        btn={SIGNUP} />
    </AuthBackground>
  );
};

export default LoginScreen;
