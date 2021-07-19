import { useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

import { LoginStateContext } from 'App';

const Login = () => {
  const [email, setEmail] = useState<Partial<string>>("");
  const [password, setPassword] = useState<Partial<string>>("");
  const [message, setMessage] = useState<Partial<string[]>>([]);
  const { setLoginState } = useContext(LoginStateContext);
  const histroy = useHistory();

  const handleSubmit = (e: any) => {
    console.log("!!handleSubmit!!");
    setMessage([]);

    const url = `http://localhost:3000/login`;
    const data = {
      user: {
        email: email,
        password: password
      }
    };
    const config = { withCredentials: true };

    axios.post(url, data, config).then(res => {
      if (res.data.logged_in === true) {
        setLoginState(true);
        histroy.push("/");
      } else {
        res.data.errors.forEach((e: string) => setMessage(message => [...message, e]));
        setPassword("");
      }
    }).catch(error => {
      console.log("エラーあり ->", error);
    });

    e.preventDefault();
  };

  const errorMessage = message.map((e, i) => {
    return (
      <div key={i}>
        {e}
      </div>
    );
  });

  return (
    <div>
      <h2>アカウントログイン</h2>
      {message &&
        <div>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
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
          id="password_firld"
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
