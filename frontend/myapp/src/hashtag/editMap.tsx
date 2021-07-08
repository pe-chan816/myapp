import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { LoadScript, GoogleMap, Autocomplete, Marker } from "@react-google-maps/api";

import { LatlngType, InformationType } from "types/typeList";

const defaultCenter = {
  lat: 35.671202,
  lng: 139.762077
};

const EditMap = () => {
  console.log("!!EditMap!!");
  const hashname = Object.values(useParams());
  const [autocompleteResult, setAutocompleteResult] = useState<any>({});
  const [latlng, setLatlng] = useState<LatlngType>(defaultCenter);
  const [information, setInformation] = useState<Partial<InformationType>>({});

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

      const newLat = data.geometry.location.lat();
      const newLng = data.geometry.location.lng();

      const newName = data.name;
      const newAddress = data.formatted_address;
      const newPhoneNumber = data.formatted_phone_number;
      const newOpeningHours = data.opening_hours.weekday_text;

      console.log(newName, newAddress, newPhoneNumber, newOpeningHours);
      setLatlng({ lat: newLat, lng: newLng });
      setInformation({
        name: newName,
        address: newAddress,
        phoneNumber: newPhoneNumber,
        openingHours: newOpeningHours
      });
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  console.log(latlng);
  console.log(information);

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
      latlng: {
        lat: latlng.lat,
        lng: latlng.lng
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
        <p>{information.name}</p>
        <p>{information.address}</p>
        <p>{information.phoneNumber}</p>
        <button onClick={updataBarInfomation}>編集</button>
      </div>
    );
  };

  const informationComponent = informationJSX();

  console.log(latlng);

  return (
    <div>
      <h1>#{hashname} を編集する</h1>
      <div>{mapComponent}</div>
      {information && <div>{informationComponent}</div>}
    </div>
  );
};

export default EditMap;
