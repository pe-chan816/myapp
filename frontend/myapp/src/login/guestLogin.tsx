import { LoginStateContext } from "App";
import axios from "axios";
import { useContext } from "react";
import { useHistory } from "react-router-dom";

const GuestLogin = () => {
  const histroy = useHistory();
  const { setLoginState } = useContext(LoginStateContext);
  const clickGuestLoginButton = () => {
    const url = `http://localhost:3000/guest`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      console.log(res);
      setLoginState(true);
      histroy.push("/");
      //window.location.replace(`http://localhost:8000/`);
    });
  };

  return (
    <div>
      <p>このアプリがどのようなものか、ゲストユーザーとして体験してみませんか？</p>
      <button onClick={clickGuestLoginButton}>ゲストログイン</button>
    </div>
  );
};

export default GuestLogin;
