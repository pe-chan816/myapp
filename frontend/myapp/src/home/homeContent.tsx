import { useState } from "react";
import axios from "axios";

import { UserType, TweetType } from "types/typeList";

import useTimeline from "hooks/useTimeline";

const HomeContent = () => {
  const [content, setContent] = useState<TweetType[]>([]);
  const [user, setUser] = useState<UserType[]>([]);

  const getContents = () => {
    setContent([]);
    setUser([]);
    const url = `http://localhost:3000`;
    const config = { withCredentials: true };
    axios.get(url, config).then(response => {
      console.log(response);
      response.data.users.forEach((e: UserType) => setUser(user => [...user, e]));
      response.data.tweets.forEach((e: TweetType) => setContent(content => [...content, e]));
    }).catch(error => {
      console.log("There are something errors", error);
    });
  };

  const Timeline = useTimeline(user, content);

  return (
    <>
      <button onClick={getContents}>更新</button>
      {Timeline}
    </>
  );
}

export default HomeContent;
