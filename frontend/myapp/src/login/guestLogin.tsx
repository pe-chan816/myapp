import axios from "axios";

const GuestLogin = () => {
  const clickGuestLoginButton = () => {
    const url = `http://localhost:3000/guest`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      console.log(res);
      window.location.replace(`http://localhost:8000/`);
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
