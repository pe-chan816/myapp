import axios from 'axios';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogActions, makeStyles } from '@material-ui/core';

import { AlertDisplayContext, AlertSeverityContext, CurrentUserContext, LoginStateContext, MessageContext } from "App";

const DeleteUserAccount = () => {
  const [dialogState, setDialogState] = useState<boolean>(false);
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { setAlertDisplay } = useContext(AlertDisplayContext);
  const { setAlertSeverity } = useContext(AlertSeverityContext);
  const { setMessage } = useContext(MessageContext);
  const { setLoginState } = useContext(LoginStateContext);
  const history = useHistory();
  const useStyles = makeStyles({
    box: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
    phrase: {
      fontSize: "13px",
      marginTop: "70px",
      textAlign: "center"
    }
  });
  const classes = useStyles();

  const clickDeleteButton = () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/users/${currentUser.id}`;
    const config = { withCredentials: true };
    axios.delete(url, config).then(res => {
      console.log(res)
      setCurrentUser({});
      setLoginState(false);
      history.push("/");
    }).catch(error => {
      console.log("error->", error);
    });
  };

  const DeleteButton = () => {
    if (currentUser.guest === true) {
      return (
        <Button
          onClick={() => {
            setAlertDisplay(true);
            setAlertSeverity("error");
            setDialogState(false);
            setMessage(["ゲストユーザーを削除することはご遠慮いただいています",
              "ゲストユーザーとしての体験を終了する場合はログアウトしていただくようお願いいたします"]);
          }}
        >
          削除する
        </Button>
      );
    } else {
      return (
        <Button onClick={clickDeleteButton}>
          削除する
        </Button>
      );
    }
  };

  const AlartDialog = () => {
    return (
      <div>
        <Dialog open={dialogState} onClose={() => { setDialogState(false) }}>
          <DialogTitle>本当にアカウントを削除しますか？</DialogTitle>
          <DialogActions>
            <Button onClick={() => { setDialogState(false) }}>
              キャンセル
            </Button>
            <DeleteButton />
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  return (
    <div className={classes.box}>
      <p className={classes.phrase}>
        もしこのアプリにご満足いただけなかったのであれば
        <br />
        アカウントを削除してしまうことも可能です
      </p>
      <Button color="secondary" onClick={() => { setDialogState(true) }}>
        アカウント削除
      </Button>
      <AlartDialog />
    </div>
  );
};

export default DeleteUserAccount;
