import axios from 'axios';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogActions, makeStyles } from '@material-ui/core';

import { CurrentUserContext } from 'App';
import { LoginStateContext } from 'App';

const DeleteUserAccount = () => {
  const [dialogState, setDialogState] = useState<boolean>(false);
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
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
    const url = `http://localhost:3000/users/${currentUser.id}`;
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

  const AlartDialog = () => {
    return (
      <div>
        <Dialog open={dialogState} onClose={() => { setDialogState(false) }}>
          <DialogTitle>本当にアカウントを削除しますか？</DialogTitle>
          <DialogActions>
            <Button onClick={() => { setDialogState(false) }}>
              キャンセル
            </Button>
            <Button onClick={clickDeleteButton}>
              削除する
            </Button>
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
