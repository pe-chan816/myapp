import { useState, useContext } from "react";
import axios from "axios";
import { Link as RouterLink, useHistory, useParams } from "react-router-dom";

import { LoadScript, GoogleMap, Autocomplete, Marker } from "@react-google-maps/api";
import { Button, Grid, Link, makeStyles, TextField } from '@material-ui/core';

import { BarInfoContext } from "./hashtagDetail";


const EditMap = () => {
  console.log("!!EditMap!!");
  const hashname = Object.values(useParams());
  const { barInfo, setBarInfo } = useContext(BarInfoContext);
  const [autocompleteResult, setAutocompleteResult] = useState<any>({});
  // const [information, setInformation] = useState<Partial<InformationType>>({});
  const history = useHistory();
  const useStyles = makeStyles({
    base: {
      margin: "0 auto",
      marginBottom: "50px",
      maxWidth: "600px",
      width: "100%"
    },
    barInfo: {
      textAlign: "center"
    }
  });
  const classes = useStyles();

  console.log(barInfo);
  const mapContainerStyle = {
    width: '100%',
    height: '60vh',
    margin: '0 auto'
  };

  const center = {
    lat: barInfo.lat,
    lng: barInfo.lng
  };

  const onLoad = (autocomplete: any) => {
    console.log('autocomplete: ', autocomplete);

    setAutocompleteResult(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocompleteResult !== null) {
      console.log(autocompleteResult.getPlace());
      const data = autocompleteResult.getPlace()

      const newName = data.name;
      const newAddress = data.formatted_address;
      const newPhoneNumber = data.formatted_phone_number;
      //const newOpeningHours = data.opening_hours.weekday_text;
      const newLat = data.geometry.location.lat();
      const newLng = data.geometry.location.lng();

      console.log(newName, newAddress, newPhoneNumber, newLat, newLng);
      setBarInfo({
        name: newName,
        address: newAddress,
        phone_number: newPhoneNumber,
        lat: newLat,
        lng: newLng
        //openingHours: newOpeningHours
      });
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  const mapJSX = () => {
    if (JSON.stringify(barInfo) !== JSON.stringify({})) {
      return (
        <>
          <LoadScript libraries={["places"]} googleMapsApiKey="AIzaSyC0xBkQV6o50tS0t-svTaLzzLigR66fow8">
            <Autocomplete
              onLoad={onLoad}
              onPlaceChanged={onPlaceChanged}
            >
              <TextField size="small" type="text" placeholder="キーワード" variant="outlined" />
            </Autocomplete>
            <GoogleMap
              id="searchbox-example"
              mapContainerStyle={mapContainerStyle}
              zoom={16}
              center={center}
            >
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
        </>
      );
    } else {
      return (
        <>
          <p>お店の情報を検索してみましょう</p>
          <LoadScript libraries={["places"]} googleMapsApiKey="AIzaSyC0xBkQV6o50tS0t-svTaLzzLigR66fow8">
            <Autocomplete
              onLoad={onLoad}
              onPlaceChanged={onPlaceChanged}
            >
              <TextField size="small" type="text" placeholder="キーワード" variant="outlined" />
            </Autocomplete>
          </LoadScript>
        </>
      );
    }
  };
  const mapComponent = mapJSX();

  const updataBarInfomation = () => {
    const url = `http://localhost:3000/hashtag/${hashname}/edit/bar`;
    const data = {
      bar: {
        name: barInfo.name,
        address: barInfo.address,
        phone_number: barInfo.phone_number,
        lat: barInfo.lat,
        lng: barInfo.lng
      }
    };
    const config = { withCredentials: true }
    axios.post(url, data, config).then(res => {
      console.log(res);
      history.push(`/hashtag/${hashname}`);
    });
  };

  const EditButton = () => {
    if (JSON.stringify(barInfo) !== JSON.stringify({})) {
      return (
        <Button color="primary" onClick={updataBarInfomation} size="small" variant="contained">
          編集
        </Button>
      );
    } else {
      return (
        <Button disabled size="small" variant="contained">
          編集
        </Button>
      );
    }
  };

  const InformationComponent = () => {
    return (
      <div className={classes.barInfo}>
        <h3>{barInfo.name}</h3>
        <p>{barInfo.address}</p>
        <p>{barInfo.phone_number}</p>
      </div>
    );
  };

  console.log("barInfo ->", barInfo);

  return (
    <Grid alignItems="center"
      className={classes.base}
      container
      direction="column"
      justifyContent="center"
    >
      <h2>
        <Link color="inherit"
          component={RouterLink}
          onClick={() => {
            const url = `http://localhost:3000/hashtag/${hashname}`;
            const config = { withCredentials: true };
            axios.get(url, config).then(res => {
              if (res.data.bar_info[0]) {
                setBarInfo(res.data.bar_info[0])
              } else {
                setBarInfo({})
              };
            });
          }}
          to={`/hashtag/${hashname}`}
        >
          #{hashname}
        </Link>
      </h2>

      {mapComponent}

      {barInfo &&
        <InformationComponent />}

      <EditButton />

    </Grid>
  );
};

export default EditMap;
