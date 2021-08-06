import { useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

import { makeStyles, TextField } from '@material-ui/core';

import { AlertDisplayContext, AlertSeverityContext, CurrentUserContext, LoginStateContext, MessageContext } from "App";
import { AlertSeverityType } from "types/typeList";

import SubmitButton from 'common/submitButton';

const Login = () => {
  const [email, setEmail] = useState<Partial<string>>("");
  const [password, setPassword] = useState<Partial<string>>("");
  const { setLoginState } = useContext(LoginStateContext);
  const { setCurrentUser } = useContext(CurrentUserContext);
  const histroy = useHistory();
  const { setAlertDisplay } = useContext(AlertDisplayContext);
  const { setAlertSeverity } = useContext(AlertSeverityContext);
  const { setMessage } = useContext(MessageContext);
  const makeAlert = (alertSeverity: AlertSeverityType, message: string[]) => {
    setAlertDisplay(true);
    setAlertSeverity(alertSeverity);
    setMessage(message);
  };

  const useStyles = makeStyles({
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

    const url = `${process.env.REACT_APP_API_DOMAIN}/login`;
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
        setCurrentUser(res.data.user);
        histroy.push("/");
        makeAlert("success", [`おかえりなさいませ`]);
      } else {
        makeAlert("error", [res.data.errors]);
        setPassword("");
      }
    }).catch(error => {
      console.log("エラーあり ->", error);
    });

    e.preventDefault();
  };

  return (
    <div className={classes.paper}>
      <h2>アカウントログイン</h2>
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

        <SubmitButton label="ログイン" />
      </form>
    </div>
  );
}

export default Login;
