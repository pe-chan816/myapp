import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type hashtagType = {
  id: number,
  hashname: string,
  create_at: string,
  updated_at: string,
  lat: string,
  lng: string,
  count: number
}

const HashtagIndex = () => {
  console.log("!!hashtagIndex!!");

  const [data, setData] = useState<hashtagType[]>([]);


  const getIndexData = () => {
    console.log("!!getIndexData!!");
    setData([]);
    const url = `http://localhost:3000/hashtags`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      res.data.hashtags.forEach((e: hashtagType) => setData(data => [...data, e]));
    });
  };

  useEffect(getIndexData, []);

  const hashtagIndexContent = data.map((e, i) => {
    return (
      <div key={i}>
        <Link to={`/hashtag/${e.hashname}`}>
          {e.hashname}({e.count})
        </Link>
      </div>
    );
  });

  return (
    <div>
      <h1>hashtag index</h1>
      <div>{hashtagIndexContent}</div>
    </div>
  );
};

export default HashtagIndex;
