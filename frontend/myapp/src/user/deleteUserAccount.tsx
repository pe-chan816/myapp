import axios from 'axios';
import { useContext, useState } from 'react';
import { useParams } from "react-router";
import { useHistory } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogActions } from '@material-ui/core';

import { AlertDisplayContext, AlertSeverityContext, CurrentUserContext, LoginStateContext, MessageContext } from "App";

const DeleteUserAccount = () => {
  const [dialogState, setDialogState] = useState<boolean>(false);
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { setAlertDisplay } = useContext(AlertDisplayContext);
  const { setAlertSeverity } = useContext(AlertSeverityContext);
  const { setMessage } = useContext(MessageContext);
  const { setLoginState } = useContext(LoginStateContext);
  const history = useHistory();

  const myPageId = Object.values(useParams());

  const clickDeleteButton = () => {
    let target;
    if (myPageId.length) {
      target = myPageId;
    } else {
      target = currentUser.id
    }

    const url = `${process.env.REACT_APP_API_DOMAIN}/users/${target}`;
    const config = { withCredentials: true };
    axios.delete(url, config).then(res => {
      if (currentUser.admin === false) {
        setCurrentUser({});
        setLoginState(false);
      }

      history.push("/");
    }).catch(error => {
      console.log("error :", error);
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
    <>
      <Button color="secondary" onClick={() => { setDialogState(true) }}>
        アカウント削除
      </Button>
      <AlartDialog />
    </>
  );
};

export default DeleteUserAccount;
