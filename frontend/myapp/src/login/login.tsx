import React, { useState, useContext } from 'react';
import axios from 'axios';

import { LoginStateContext } from 'App';
import { LoginUserContext } from 'App';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginState, dispatchLoginState } = useContext(LoginStateContext);

  const handleSubmit = (e: any) => {
    console.log("ログインイベント発火");

    axios.post("http://localhost:3000/login", {
      user: {
        email: email,
        password: password
      }
    },
      { withCredentials: true }
    ).then(response => {
      if (response.data.logged_in === true) {
        dispatchLoginState();
        console.log("login response: ", response);
      }
    }).catch(error => [
      console.log(error, "エラーがあるよ")
    ]);

    e.preventDefault();
  }

  return (
    <div>
      <h2>アカウントログイン</h2>
      <form onSubmit={handleSubmit}>
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

        <button type="submit">!!ログイン!!</button>
      </form>
    </div>
  );
}

export default Login;
