import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

import { TimelineType } from "types/typeList";

import useTimeline from "hooks/useTimeline";

type hashtagType = {
  id: number,
  hashname: string,
  create_at: string,
  updated_at: string
};

type recipeType = {
  id: number,
  material: string,
  amount?: string,
  unit: string,
  created_at: string,
  updated_at: string,
  hashtag_id: number,
  position: number
};

type latlngType = {
  lat: number,
  lng: number
}

const defaultLatlng = {
  lat: 35.671202,
  lng: 139.762077
};

const HashtagDetail = () => {
  console.log("!!HashtagDetail!!");
  const hashname = Object.values(useParams());
  const [tagData, setTagData] = useState<hashtagType>();
  const [timelineData, setTimelineData] = useState<Partial<TimelineType[]>>([]);
  const [recipe, setRecipe] = useState<Partial<recipeType[]>>([]);
  const [latlng, setLatlng] = useState<Partial<latlngType>>(defaultLatlng);

  const resetData = () => {
    setTimelineData([]);
    setRecipe([]);
    setLatlng(defaultLatlng);
  };

  const getDetailData = () => {
    console.log("!!getDetailData!!");
    resetData();
    const url = `http://localhost:3000/hashtag/${hashname}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      console.log(res);
      setTagData(res.data.hashtag);
      res.data.tweets.forEach((e: TimelineType) => setTimelineData(timelineData => [...timelineData, e]));
      res.data.recipes.forEach((e: recipeType) => setRecipe(recipe => [...recipe, e]));
      setLatlng(res.data.latlng[0]);
    });
  };

  useEffect(getDetailData, []);

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
    const containerStyle = {
      width: '70%',
      height: '60vh',
      margin: '0 auto'
    };

    const center = {
      lat: latlng.lat,
      lng: latlng.lng
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
        <Link to={`/hashtag/${tagData?.hashname}/edit/map`}>マップ編集</Link>
      </div>
    );
  };

  const barContent = barLocation();

  const timeline = useTimeline(timelineData);

  console.log(tagData);
  console.log(timelineData);
  console.log(recipe);
  console.log(latlng);

  return (
    <div>
      <h1>#{tagData?.hashname}</h1>
      <div>{recipeList}</div>
      <div>{barContent}</div>
      <div>{timeline}</div>
    </div>
  );
};

export default HashtagDetail;
