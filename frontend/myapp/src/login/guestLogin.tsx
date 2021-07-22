import axios from "axios";
import { useContext } from "react";
import { useHistory } from "react-router-dom";

import { Button, Grid, makeStyles } from '@material-ui/core';

import { LoginStateContext } from "App";

const GuestLogin = () => {
  const histroy = useHistory();
  const { setLoginState } = useContext(LoginStateContext);
  const useStyles = makeStyles({
    text: {
      fontSize: 13,
      marginTop: 40,
      textAlign: "center"
    }
  });
  const classes = useStyles();

  const clickGuestLoginButton = () => {
    const url = `http://localhost:3000/guest`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      console.log(res);
      setLoginState(true);
      histroy.push("/");
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
