import { useContext } from "react";
import { AlertDisplayContext, AlertSeverityContext, MessageContext } from "App";
import { Alert } from '@material-ui/lab';

const AlertMessage = () => {
  const { alertDisplay, setAlertDisplay } = useContext(AlertDisplayContext);
  const { alertSeverity, setAlertSeverity } = useContext(AlertSeverityContext);
  const { message, setMessage } = useContext(MessageContext);
  const resetProps = () => {
    setAlertDisplay(false);
    setAlertSeverity("success");
    setMessage([]);
  };
  const messageContent = message.map((e, i) => {
    return (
      <div key={i}>
        {e}
      </div>
    );
  })

  if (alertDisplay === true) {
    return (
      <Alert
        onClose={resetProps}
        severity={alertSeverity}
      >
        {messageContent}
      </Alert>
    );
  } else {
    return (null);
  }
};
export default AlertMessage;
