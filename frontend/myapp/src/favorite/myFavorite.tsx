import axios from "axios";
import { useState, useLayoutEffect } from "react";
import { useParams } from "react-router";

import { TimelineType } from "types/typeList";

import useTimeline from "hooks/useTimeline";


const MyFavorite = (props: any) => {
  console.log(props);
  const userId = Object.values(useParams());
  const [data, setData] = useState<Partial<TimelineType[]>>([]);

  const getFavoriteData = () => {
    setData([]);
    const url = `http://localhost:3000/users/${userId}/myfavorite`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      console.log(res);
      res.data.my_favorites.forEach((e: TimelineType) => setData(data => [...data, e]));
    });
  };

  useLayoutEffect(getFavoriteData, []);

  /*
  const timeline = data.map((e, i) => {
    if (e) {
      return (
        <div key={i}>
          {e.profile_image?.url && <img src={`http://localhost:3000/${e.profile_image.url}`} alt="user" />}
          <p>{e.name}</p>
          <p>{e.content}</p>
          {e.tweet_image?.url && <img src={`http://localhost:3000/${e.tweet_image.url}`} alt="tweet" />}
          <p>{e.created_at}</p>
        </div>
      );
    }
  });
*/
  const timeline = useTimeline(data);

  console.log(data);
  return (
    <div>
      <h1>my favorite</h1>
      <div>{timeline}</div>
    </div>
  );
};

export default MyFavorite
