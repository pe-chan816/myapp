import { useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

import { Button, makeStyles, TextField } from '@material-ui/core';

import { LoginStateContext } from 'App';

const Login = () => {
  const [email, setEmail] = useState<Partial<string>>("");
  const [password, setPassword] = useState<Partial<string>>("");
  const [message, setMessage] = useState<Partial<string[]>>([]);
  const { setLoginState } = useContext(LoginStateContext);
  const histroy = useHistory();

  const useStyles = makeStyles({
    button: {
      marginTop: 10
    },
    error: {
      color: "firebrick"
    },
    paper: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      margin: "0 auto",
      width: "60%"
    },
    form: {
      width: "100%",
      marginTop: 5
    }
  });
  const classes = useStyles();

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
      <div className={classes.error} key={i}>
        {e}
      </div>
    );
  });

  return (
    <div className={classes.paper}>
      <h2>アカウントログイン</h2>
      {message &&
        <div>{errorMessage}</div>}
      <form className={classes.paper} onSubmit={handleSubmit}>
        <TextField
          className={classes.form}
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          type="email"
          value={email}
        />
        <TextField
          className={classes.form}
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          type="password"
          value={password}
        />
        <Button className={classes.button} color="primary" type="submit" variant="contained">
          ログイン
        </Button>
      </form>
    </div>
  );
}

export default Login;
