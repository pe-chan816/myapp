import { useContext, useState } from "react";
import { TagDataContext, RecipeContext, BarInfoContext } from "./hashtagDetail";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

import { Button, Dialog, DialogActions, DialogContentText, DialogTitle, FormControl, FormControlLabel, Grid, Link, makeStyles, Radio, RadioGroup, Tooltip } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from "axios";

import { AlertDisplayContext, AlertSeverityContext, MessageContext, CurrentUserContext } from "App";
import { AlertSeverityType } from "types/typeList";

const HashtagDetailContent = () => {
  const { tagData } = useContext(TagDataContext);
  const { recipe } = useContext(RecipeContext);
  const { barInfo } = useContext(BarInfoContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showRecipeEdit, setShowRecipeEdit] = useState<boolean>(false);
  const [showBarInfoEdit, setShowBarInfoEdit] = useState<boolean>(false);
  const [radioValue, setRadioValue] = useState<string>("");
  const [dialogDisplay, setDialogDisplay] = useState<boolean>(false);
  const history = useHistory();
  const useStyles = makeStyles({
    base: {
      margin: "0 auto",
      maxWidth: "600px"
    },
    dialog: {
      margin: "20px auto",
      maxWidth: "600px",
      width: "80%"
    },
    content: {
      textAlign: "center",
      width: "100%"
    }
  });
  const classes = useStyles();

  const { setAlertDisplay } = useContext(AlertDisplayContext);
  const { setAlertSeverity } = useContext(AlertSeverityContext);
  const { setMessage } = useContext(MessageContext);
  const makeAlert = (alertSeverity: AlertSeverityType, message: string[]) => {
    setAlertDisplay(true);
    setAlertSeverity(alertSeverity);
    setMessage(message);
  };

  const recipeList = recipe.map((e, i) => {
    if (e) {
      return (
        <div key={i}>
          <p>{e.material} : {e.amount} {e.unit}</p>
        </div>
      );
    };
  });

  const barLocation = () => {
    if (barInfo) {
      const containerStyle = {
        width: '100%',
        height: '45vh',
        margin: '0 auto'
      };

      const center = {
        lat: barInfo.lat,
        lng: barInfo.lng
      };

      return (
        <div>
          <LoadScript googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={16}
            >
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
          <div>
            <h3>{barInfo.name}</h3>
            <p>{barInfo.address}</p>
            <p>{barInfo.phone_number}</p>
          </div>
        </div>

      );
    };
  };
  const barContent = barLocation();

  const linkWithRadioButtonContent = () => {
    return (
      <div>
        <p>このタグがカクテルについてのものならレシピを、
          <br />
          BARについてのものならGooglemapを利用してお店の情報を登録してみましょう！
        </p>

        <Grid container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <FormControl>
            <RadioGroup row value={radioValue}
              onChange={(e) => { setRadioValue(e.target.value) }}
            >
              <FormControlLabel control={<Radio color="primary" size="small" />}
                label="カクテル"
                onChange={() => {
                  setShowRecipeEdit(true);
                  setShowBarInfoEdit(false);
                }}
                value="cocktail" />
              <FormControlLabel control={<Radio color="primary" size="small" />}
                label="BAR"
                onChange={() => {
                  setShowRecipeEdit(false);
                  setShowBarInfoEdit(true);
                }}
                value="bar" />
            </RadioGroup>
          </FormControl>

          {showRecipeEdit &&
            <Link component={RouterLink} to={`/hashtag/${tagData.hashname}/edit/recipe`}>
              レシピ編集
            </Link>}
          {showBarInfoEdit &&
            <Link component={RouterLink} to={`/hashtag/${tagData?.hashname}/edit/map`}>
              マップ編集
            </Link>}
        </Grid>
      </div>
    );
  };

  const closeDialog = () => {
    setShowEdit(false);
    setRadioValue("");
    setShowRecipeEdit(false);
    setShowBarInfoEdit(false);
    setDialogDisplay(false);
  };

  const clickTagDeleteButton = () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/hashtag/${tagData.hashname}`;
    const config = { withCredentials: true };
    axios.delete(url, config).then(res => {
      makeAlert("success", [`${res.data.message}`]);
      history.push("/");
    }).catch(error => console.log("error: ", error));
  };

  const ConfirmationDialog = () => {
    return (
      <Dialog open={dialogDisplay} onClose={() => { closeDialog() }}>
        <DialogTitle>本当にこのタグを削除しますか？</DialogTitle>
        <DialogActions>
          <Button onClick={() => { closeDialog() }}>
            キャンセル
          </Button>
          <Button onClick={clickTagDeleteButton}>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const linkWithRadioButton = linkWithRadioButtonContent();

  return (
    <Grid alignItems="center"
      className={classes.base}
      container
      direction="column"
      justifyContent="center"
    >
      <Grid item>
        <Grid alignItems="center"
          container
          direction="row"
          justifyContent="center"
          spacing={2}
        >
          <Grid item>
            <h2>#{tagData?.hashname}</h2>
          </Grid>
          <Grid item>
            <Tooltip title="タグ編集">
              <Link color="inherit"
                component="button"
                onClick={() => setShowEdit(!showEdit)}
                data-testid="SettingsIcon"
              >
                <SettingsIcon />
              </Link>
            </Tooltip>
          </Grid>
          {currentUser.admin === true &&
            <Grid item>
              <Tooltip title="タグ削除">
                <Link
                  color="inherit"
                  component="button"
                  onClick={() => { setDialogDisplay(true) }}
                >
                  <DeleteIcon />
                </Link>
              </Tooltip>
              <ConfirmationDialog />
            </Grid>
          }
        </Grid>
      </Grid>

      <Grid className={classes.content} item>
        {recipe.toString() !== [].toString() &&
          <div>{recipeList}</div>}
        {JSON.stringify(barInfo) !== JSON.stringify({}) &&
          <div>{barContent}</div>}
      </Grid>

      <Dialog open={showEdit} onClose={closeDialog}>
        <DialogContentText className={classes.dialog}>
          {linkWithRadioButton}
        </DialogContentText>
      </Dialog>

    </Grid>
  );
};

export default HashtagDetailContent;
