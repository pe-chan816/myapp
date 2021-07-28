import { useContext, useState } from "react";
import { TagDataContext, RecipeContext, BarInfoContext } from "./hashtagDetail";
import { Link as RouterLink } from "react-router-dom";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

import { Dialog, DialogContentText, FormControl, FormControlLabel, Grid, Link, makeStyles, Radio, RadioGroup, Tooltip } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

const HashtagDetailContent = () => {
  console.log("!!HashtagDetailContext!!");
  const { tagData } = useContext(TagDataContext);
  const { recipe } = useContext(RecipeContext);
  const { barInfo } = useContext(BarInfoContext);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showRecipeEdit, setShowRecipeEdit] = useState<boolean>(false);
  const [showBarInfoEdit, setShowBarInfoEdit] = useState<boolean>(false);
  const [radioValue, setRadioValue] = useState<string>("");
  const useStyles = makeStyles({
    base: {
      margin: "0 auto",
      maxWidth: "800px"
    },
    dialog: {
      margin: "20px auto",
      maxWidth: "800px",
      width: "80%"
    },
    content: {
      textAlign: "center",
      width: "100%"
    }
  });
  const classes = useStyles();

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
          <LoadScript googleMapsApiKey="AIzaSyC0xBkQV6o50tS0t-svTaLzzLigR66fow8">
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
    setShowEdit(!showEdit);
    setRadioValue("");
    setShowRecipeEdit(false);
    setShowBarInfoEdit(false);
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
