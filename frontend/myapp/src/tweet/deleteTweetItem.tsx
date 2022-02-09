import axios from "axios";
import { useState, useContext } from "react";

import { Button, Dialog, DialogTitle, DialogActions, Link, makeStyles, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { AlertSeverityType, TimelineType } from "types/typeList";

import { AlertDisplayContext, AlertSeverityContext, CurrentUserContext, MessageContext } from "App";
import { TimelineDataContext } from "tweet/timeline";

const DeleteTweetItem = (props: { indexNumber: number, item: TimelineType }) => {
  const { setAlertDisplay } = useContext(AlertDisplayContext);
  const { setAlertSeverity } = useContext(AlertSeverityContext);
  const { currentUser } = useContext(CurrentUserContext);
  const { data, setData } = useContext(TimelineDataContext);
  const [dialogDisplay, setDialogDisplay] = useState<boolean>(false);
  const { setMessage } = useContext(MessageContext);
  const useStyles = makeStyles({
    deleteButton: {
      margin: "0 8px"
    }
  });
  const classes = useStyles();
  const itemData = props.item;
  const indexNumber = props.indexNumber;

  const makeAlert = (alertSeverity: AlertSeverityType, message: string[]) => {
    setAlertDisplay(true);
    setAlertSeverity(alertSeverity);
    setMessage(message);
  };

  const clickDeleteButton = () => {
    const newData = [...data];
    const url = `${process.env.REACT_APP_API_DOMAIN}/tweets/${itemData.id}`;
    const config = { withCredentials: true };
    axios.delete(url, config).then(res => {
      newData.splice(indexNumber, 1);
      return newData;
    }).then(newData => {
      setData(newData);
      setDialogDisplay(false);
      makeAlert("success", ["ポストを削除しました"]);
    });
  };

  const ConfirmationDialog = () => {
    return (
      <Dialog open={dialogDisplay} onClose={() => { setDialogDisplay(false) }}>
        <DialogTitle>本当にこのポストを削除しますか？</DialogTitle>
        <DialogActions>
          <Button onClick={() => { setDialogDisplay(false) }}>
            キャンセル
          </Button>
          <Button onClick={clickDeleteButton}>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (itemData.user_id === currentUser.id ||
    currentUser.admin === true) {
    return (
      <>
        <Tooltip title="ポスト削除">
          <Link className={classes.deleteButton}
            color="inherit"
            component="button"
            data-testid="DeleteIcon"
            onClick={() => { setDialogDisplay(true) }}
          >
            <DeleteIcon />
          </Link>
        </Tooltip>
        <ConfirmationDialog />
      </>
    );
  } else {
    return null;
  }
};

export default DeleteTweetItem;
