import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

import { TimelineType } from "types/typeList";

import Timeline from "tweet/timeline";

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

  useEffect(getFavoriteData, []);

  console.log(data);
  return (
    <div>
      <h3>いいねしたツイート</h3>
      <Timeline data={data} />
    </div>
  );
};

export default MyFavorite
