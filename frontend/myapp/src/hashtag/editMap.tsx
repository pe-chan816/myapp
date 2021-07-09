import { useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { LoadScript, GoogleMap, Autocomplete, Marker } from "@react-google-maps/api";

import { LatlngType } from "types/typeList";

import { BarInfoContext } from "./hashtagDetail";

const defaultCenter = {
  lat: 35.671202,
  lng: 139.762077
};

const EditMap = () => {
  console.log("!!EditMap!!");
  const hashname = Object.values(useParams());
  const { barInfo, setBarInfo } = useContext(BarInfoContext);
  const [autocompleteResult, setAutocompleteResult] = useState<any>({});
  const [latlng, setLatlng] = useState<LatlngType>(defaultCenter);
  // const [information, setInformation] = useState<Partial<InformationType>>({});

  const mapContainerStyle = {
    width: '70%',
    height: '60vh',
    margin: '0 auto'
  };

  const center = {
    lat: latlng.lat,
    lng: latlng.lng
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
      setLatlng({ lat: newLat, lng: newLng });
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

  console.log(latlng);
  //console.log("information->", information);

  const mapJSX = () => {
    return (
      <div>
        <LoadScript libraries={["places"]} googleMapsApiKey="AIzaSyC0xBkQV6o50tS0t-svTaLzzLigR66fow8">
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              placeholder="キーワード"
              style={{
              }}
            />
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
      </div>
    );
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
      window.location.replace(`http://localhost:8000/hashtag/${hashname}`)
    });
  };

  const informationJSX = () => {
    return (
      <div>
        <p>{barInfo.name}</p>
        <p>{barInfo.address}</p>
        <p>{barInfo.phone_number}</p>
        <button onClick={updataBarInfomation}>変更</button>
      </div>
    );
  };

  const informationComponent = informationJSX();

  console.log("barInfo ->", barInfo);

  return (
    <div>
      <h1>#{hashname} を編集する</h1>
      <div>{mapComponent}</div>
      {barInfo && <div>{informationComponent}</div>}
    </div>
  );
};

export default EditMap;
