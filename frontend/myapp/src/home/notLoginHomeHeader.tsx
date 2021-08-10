import { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Link as RouterLink } from 'react-router-dom';

import { Container, Grid, Link, makeStyles } from '@material-ui/core';

import { AlertDisplayContext, MessageContext } from "App";

import AlertMessage from 'common/alertMessage';
import Login from "login/login";
import Signup from "signup/signup";

const NotLoginHomeHeader = () => {
  const { setAlertDisplay } = useContext(AlertDisplayContext);
  const { setMessage } = useContext(MessageContext);
  const useStyles = makeStyles({
    header: {
      backdropFilter: "blur(20px)",
      padding: "0 20px 0  20px",
      position: "fixed",
      top: 0,
      zIndex: 10
    },
    home: {
      fontSize: "20px",
      textAlign: "center",
    }
  });
  const classes = useStyles();

  const resetAlert = () => {
    setAlertDisplay(false);
    setMessage([]);
  };

  const Home = () => {
    return (
      <div className={classes.home}>
        <h2>Insyutagram へようこそ！</h2>
        <p>
          お酒好きのためのSNSアプリです。
          <br />
          誰かがつぶやいたお酒やBARの話をアテに今夜も飲みませんか？
          <br />
          <br />
          そしてあなたも
          <br />
          今から飲むカクテルやお店のことをつぶやいて
          <br />
          みんなで楽しい気持ちをシェアしましょう！
        </p>
      </div>
    );
  }

  return (
    <div>
      <Grid alignItems="baseline" className={classes.header} container
        direction="row" justifyContent="flex-start" spacing={2}>
        <Grid item>
          <Link color="inherit" component={RouterLink} onClick={resetAlert} underline="none" to="/">
            <h2>Insyutagram</h2>
          </Link>
        </Grid>
        <Grid item>
          <Link color="inherit" component={RouterLink} onClick={resetAlert} to="/login">
            ログイン
          </Link>
        </Grid>
        <Grid item>
          <Link color="inherit" component={RouterLink} onClick={resetAlert} to="/signup">
            アカウント登録
          </Link>
        </Grid>
      </Grid>

      <Container>
        <AlertMessage />

        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
        </Switch>

      </Container>
    </div>
  );
}

export default NotLoginHomeHeader;
