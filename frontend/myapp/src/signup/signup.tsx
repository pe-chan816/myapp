import React, { useContext, useState } from 'react';
import axios from 'axios';

import { LoginStateContext } from 'App';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const { loginState, dispatchLoginState } = useContext(LoginStateContext);

  const handleSubmit = (e: any) => {
    console.log("アカウント作成イベント発火");

    axios.post("http://localhost:3000/signup", {
      user: {
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation
      }
    },
      { withCredentials: true }
    ).then(response => {
      if (response.data.status === "created") {
        //const { loginState, dispatchLoginState } = useContext(LoginStateContext);
        dispatchLoginState();
      }
      console.log(response, "railsに値を渡しました");
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
    </div>
  );
}

export default Signup;
