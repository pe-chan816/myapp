import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { LoginStateContext } from 'App';

import GuestLogin from 'login/guestLogin';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState<Partial<string[]>>([]);
  const { setLoginState } = useContext(LoginStateContext);
  const histroy = useHistory();

  const handleSubmit = (e: any) => {
    console.log("アカウント作成イベント発火");
    const url = `http://localhost:3000/signup`;
    const data = {
      user: {
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation
      }
    };
    const config = { withCredentials: true };
    axios.post(url, data, config).then(res => {
      if (res.data.status === "created") {
        setLoginState(true);
        histroy.push("/");
        //window.location.replace(`http://localhost:8000/`);
      } else {
        res.data.messages.forEach((e: string) => setMessage(message => [...message, e]));
        setPassword("");
        setPasswordConfirmation("");
      }
      console.log(res, "railsに値を渡しました");
    }).catch(error => [
      console.log(error, "エラーがあるよ")
    ]);

    e.preventDefault();
  }
  const errorMessage = message.map((e, i) => {
    return (
      <div key={i}>
        {e}
      </div>
    );
  });

  return (
    <div>
      <h2>新規アカウント登録</h2>
      {message &&
        <div>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name_field">Name:</label>
        <input
          id="name_field"
          type="text"
          name="name"
          placeholder="ハンドルネーム"
          value={name}
          onChange={(e) => setName(e.target.value)} />
        <label htmlFor="email_field">Email:</label>
        <input
          id="email_field"
          type="email"
          name="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password_field">Password:</label>
        <input
          id="password_field"
          type="password"
          name="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <label htmlFor="pass_confirmation_field"></label>
        <input
          id="pass_confirmation_field"
          type="password"
          name="password_confirmation"
          placeholder="もう一度パスワードを入力してください"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)} />
        <button type="submit">!!アカウント作成!!</button>
      </form>

      <GuestLogin />
    </div>
  );
}

export default Signup;
