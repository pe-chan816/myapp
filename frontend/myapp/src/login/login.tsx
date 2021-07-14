import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState<Partial<string>>("");
  const [password, setPassword] = useState<Partial<string>>("");
  const [message, setMessage] = useState<Partial<string[]>>([]);

  const handleSubmit = (e: any) => {
    console.log("ログインイベント発火");
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
        window.location.replace(`http://localhost:8000/`);
      } else {
        res.data.errors.forEach((e: string) => setMessage(message => [...message, e]));
        setPassword("");
      }
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
