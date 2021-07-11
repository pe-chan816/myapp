import { useContext, useState } from 'react';
import axios from 'axios';

import { LoginStateContext } from 'App';

import GuestLogin from 'login/guestLogin';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const { setLoginState } = useContext(LoginStateContext);

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
      }
      console.log(res, "railsに値を渡しました");
    }).catch(error => [
      console.log(error, "エラーがあるよ")
    ]);

    e.preventDefault();
  }

  return (
    <div>
      <h2>新規アカウント登録</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)} />
        <input
          type="email"
          name="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          name="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <input
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
