import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import AuthBackground from "../components/AuthComponents/AuthBackground"
import AuthMainBar from "../components/AuthComponents/AuthMainBar"
import AuthSideBar from "../components/AuthComponents/AuthSideBar"
import InputComponent from "../components/AuthComponents/InputComponent"
import { useNavigate } from "react-router-dom";
import { SIGNIN, REGISTER, LOGIN_PATHNAME, REGISTER_SIDEBAR_TITLE, SIGNUP } from "../constants/names";

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    navigate(LOGIN_PATHNAME)
  }
  const handleRegister = () => {
    navigate("/onboarding")
  }

  return (
    <AuthBackground reverse={false}>
      <AuthSideBar
        onClick={() => { handleSignIn() }}
        title={REGISTER_SIDEBAR_TITLE}
        btn={SIGNIN} />
        <AuthMainBar
          btn={SIGNUP} title={REGISTER} onClick={handleRegister}>
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
        </AuthMainBar>
    </AuthBackground>
  );
};

export default RegisterScreen;
