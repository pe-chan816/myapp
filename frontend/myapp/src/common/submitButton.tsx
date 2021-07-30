import { useContext, useState } from "react";
import { Button, makeStyles } from "@material-ui/core";

import { AlertDisplayContext, AlertSeverityContext, CurrentUserContext, MessageContext } from "App";

import { AlertSeverityType } from "types/typeList";

const SubmitButton = (props: { label: string, message?: string, severity?: AlertSeverityType }) => {
  const { currentUser } = useContext(CurrentUserContext);
  const { setAlertDisplay } = useContext(AlertDisplayContext);
  const { setAlertSeverity } = useContext(AlertSeverityContext);
  const { setMessage } = useContext(MessageContext);
  const useStyles = makeStyles({
    button: {
      marginTop: 10
    }
  });
  const classes = useStyles();

  if (currentUser.guest === true) {
    return (
      <>
        <Button className={classes.button}
          color="primary"
          fullWidth
          onClick={() => {
            setAlertDisplay(true);
            setAlertSeverity("error");
            setMessage([`${props.message}`]);
          }}
          variant="contained"
        >
          {props.label}
        </Button>
      </>
    );
  } else {
    return (
      <Button className={classes.button} color="primary" fullWidth type="submit" variant="contained">
        {props.label}
      </Button>
    );
  }
};

export default SubmitButton;
