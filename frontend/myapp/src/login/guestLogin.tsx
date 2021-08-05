import axios from "axios";
import { useContext } from "react";
import { useHistory } from "react-router-dom";

import { Button, Grid, makeStyles } from '@material-ui/core';

import { AlertDisplayContext, AlertSeverityContext, CurrentUserContext, LoginStateContext, MessageContext } from "App";
import { AlertSeverityType } from "types/typeList";

const GuestLogin = () => {
  const histroy = useHistory();
  const { setLoginState } = useContext(LoginStateContext);
  const { setCurrentUser } = useContext(CurrentUserContext);
  const { setAlertDisplay } = useContext(AlertDisplayContext);
  const { setAlertSeverity } = useContext(AlertSeverityContext);
  const { setMessage } = useContext(MessageContext);
  const makeAlert = (alertSeverity: AlertSeverityType, message: string[]) => {
    setAlertDisplay(true);
    setAlertSeverity(alertSeverity);
    setMessage(message);
  };
  const useStyles = makeStyles({
    text: {
      fontSize: 13,
      marginTop: 40,
      textAlign: "center"
    }
  });
  const classes = useStyles();

  const clickGuestLoginButton = () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/guest`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      console.log(res);
      setLoginState(true);
      setCurrentUser(res.data.user);
      histroy.push("/");
      makeAlert("success", ["ようこそいらっしゃいました"]);
    });
  };

  return (
    <div className={classes.text}>
      <Grid alignItems="center" container direction="column" justifyContent="center">
        <Grid item>
          <p>このアプリがどのようなものか<br />
            ゲストユーザーとして体験してみませんか？</p>
        </Grid>
        <Grid item>
          <Button color="primary" onClick={clickGuestLoginButton}>
            ゲストとして利用してみる
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default GuestLogin;
