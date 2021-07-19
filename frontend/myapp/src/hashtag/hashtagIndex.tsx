import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { HashtagType } from "types/typeList";

const HashtagIndex = () => {
  console.log("!!hashtagIndex!!");

  const [data, setData] = useState<HashtagType[]>([]);

  const getIndexData = () => {
    console.log("!!getIndexData!!");
    setData([]);
    const url = `http://localhost:3000/hashtags`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      res.data.hashtags.forEach((e: HashtagType) => setData(data => [...data, e]));
    }).catch(error => {
      console.log("error ->", error);
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
      <h3>ハッシュタグ一覧</h3>
      <div>{hashtagIndexContent}</div>
    </div>
  );
};

export default HashtagIndex;
