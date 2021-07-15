import { useEffect, useState } from "react";
import axios from "axios";

import { TimelineType } from "types/typeList";

import useTimeline from "hooks/useTimeline";

const HomeContent = () => {
  console.log("!!HomeContent!!");

  //const [content, setContent] = useState<TweetType[]>([]);
  //const [user, setUser] = useState<UserType[]>([]);

  const [data, setData] = useState<TimelineType[]>([]);

  const getContents = () => {
    setData([]);
    const url = `http://localhost:3000`;
    const config = { withCredentials: true };
    axios.get(url, config).then(response => {
      console.log(response);
      response.data.home_data.forEach((e: TimelineType) => setData(data => [...data, e]));
      //response.data.users.forEach((e: UserType) => setUser(user => [...user, e]));
      //response.data.tweets.forEach((e: TweetType) => setContent(content => [...content, e]));
    }).catch(error => {
      console.log("There are something errors", error);
    });
  };

  useEffect(getContents, []);

  const Timeline = useTimeline(data);

  return (
    <>
      <button onClick={getContents}>更新</button>
      {data.toString() !== [].toString() &&
        Timeline}
    </>
  );
}

export default HomeContent;
