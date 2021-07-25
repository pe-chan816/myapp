import axios from 'axios';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles, TextField } from '@material-ui/core';

import { LoginStateContext } from 'App';

import GuestLogin from 'login/guestLogin';
import SubmitButton from 'common/submitButton';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState<Partial<string[]>>([]);
  const { setLoginState } = useContext(LoginStateContext);
  const histroy = useHistory();

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
      } else {
        res.data.messages.forEach((e: string) => setMessage(message => [...message, e]));
        setPassword("");
        setPasswordConfirmation("");
      }
      console.log(res, "railsに値を渡しました");
    }).catch(error => {
      console.log("errors ->", error);
    });

    e.preventDefault();
  }
  const errorMessage = message.map((e, i) => {
    return (
      <div className={classes.error} key={i}>
        {e}
      </div>
    );
  });

  return (
    <div className={classes.paper}>
      <h2>新規アカウント登録</h2>
      {message &&
        <div>{errorMessage}</div>}
      <form className={classes.paper} onSubmit={handleSubmit}>
        <TextField
          className={classes.form}
          label="Name"
          onChange={(e) => setName(e.target.value)}
          placeholder="ハンドルネーム"
          type="text"
          value={name}
        />
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
        {password &&
          <TextField
            className={classes.form}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="もう一度パスワードを入力してください"
            type="password"
            value={passwordConfirmation}
          />
        }

        <SubmitButton label="アカウント作成" />
      </form>

      <GuestLogin />
    </div>
  );
}

export default Signup;
