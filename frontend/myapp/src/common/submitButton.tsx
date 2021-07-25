import { Button, makeStyles } from "@material-ui/core";

const SubmitButton = (props: { label: string }) => {
  const useStyles = makeStyles({
    button: {
      marginTop: 10
    }
  });
  const classes = useStyles();

  return (
    <>
      <Button className={classes.button} color="primary" type="submit" variant="contained">
        {props.label}
      </Button>
    </>
  );
};

export default SubmitButton;
