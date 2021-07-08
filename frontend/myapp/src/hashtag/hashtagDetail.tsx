import axios from "axios";
import { useEffect, useState, createContext } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, useParams } from "react-router";
import { Link } from "react-router-dom";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

import { LatlngType, TimelineType, RecipeType } from "types/typeList";

import EditRecipe from "./editRecipe";

import useTimeline from "hooks/useTimeline";

type hashtagType = {
  id: number,
  hashname: string,
  create_at: string,
  updated_at: string
};

export const RecipeContext = createContext({} as {
  recipe: Partial<RecipeType[]>,
  setRecipe: any
});

const HashtagDetail = () => {
  console.log("!!HashtagDetail!!");
  const hashname = Object.values(useParams());
  const [tagData, setTagData] = useState<hashtagType>();
  const [timelineData, setTimelineData] = useState<Partial<TimelineType[]>>([]);
  const [recipe, setRecipe] = useState<Partial<RecipeType[]>>([]);
  const [latlng, setLatlng] = useState<Partial<LatlngType>>();

  const resetData = () => {
    setTimelineData([]);
    setRecipe([]);
    setLatlng(undefined);
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
      res.data.recipes.forEach((e: RecipeType) => setRecipe(recipe => [...recipe, e]));
      if (res.data.latlng[0]) { setLatlng(res.data.latlng[0]) };
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
    if (latlng) {
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
  };

  const barContent = barLocation();

  const timeline = useTimeline(timelineData);

  console.log(tagData);
  console.log(timelineData);
  console.log(recipe);
  console.log(latlng);

  return (
    <Router>
      <RecipeContext.Provider value={{ recipe, setRecipe }}>
        <div>
          <h1>#{tagData?.hashname}</h1>
          <div>{recipeList}</div>
          {recipe && <Link to={`/hashtag/${hashname}/edit/recipe`}>レシピ編集</Link>}
          <div>{barContent}</div>
          <div>{timeline}</div>
        </div>
        <Route path="/hashtag/:hashname/edit/recipe" exact component={EditRecipe} />
      </RecipeContext.Provider>
    </Router>
  );
};

export default HashtagDetail;
