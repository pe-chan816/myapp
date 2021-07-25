import { useEffect, useState } from "react";
import axios from "axios";

import { TimelineType } from "types/typeList";

import Timeline from "tweet/timeline";

const HomeContent = () => {
  console.log("!!HomeContent!!");

  const [data, setData] = useState<TimelineType[]>([]);

  const getContents = () => {
    setData([]);
    const url = `http://localhost:3000`;
    const config = { withCredentials: true };
    axios.get(url, config).then(response => {
      response.data.home_data.forEach((e: TimelineType) => setData(data => [...data, e]));
    }).catch(error => {
      console.log("There are something errors", error);
    });
  };

  useEffect(getContents, []);

  return (
    <div>
      <button onClick={getContents}>更新</button>
      {data.toString() !== [].toString() &&
        <Timeline data={data} />}
    </div>
  );
}

export default HomeContent;
