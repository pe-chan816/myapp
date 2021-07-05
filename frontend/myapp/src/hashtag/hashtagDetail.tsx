import axios from "axios";
import useTimeline from "hooks/useTimeline";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { TimelineType } from "types/typeList";

type hashtagType = {
  id: number,
  hashname: string,
  create_at: string,
  updated_at: string,
  lat: string,
  lng: string
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

const HashtagDetail = () => {
  console.log("!!HashtagDetail!!");
  const hashname = Object.values(useParams());
  const [tagData, setTagData] = useState<hashtagType>();
  const [timelineData, setTimelineData] = useState<Partial<TimelineType[]>>([]);
  const [recipe, setRecipe] = useState<Partial<recipeType[]>>([]);

  const resetData = () => {
    setTimelineData([]);
    setRecipe([]);
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


  const timeline = useTimeline(timelineData);

  console.log(tagData);
  console.log(timelineData);
  console.log(recipe);

  return (
    <div>
      <h1>#{tagData?.hashname}</h1>
      <div>{recipeList}</div>
      <div>{timeline}</div>
    </div>
  );
};

export default HashtagDetail;
