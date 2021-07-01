import { useState } from "react";
import axios from "axios";

import useTimeline from "hooks/useTimeline";//!!!

const HomeContent = () => {
  type contentType = {
    content: string,
    created_at: string,
    id: number,
    tweet_image?: { url: string },
    user_id: number,
  }

  type userType = {
    id: number,
    name: string,
    profile_image?: { url: string }
  }

  const [content, setContent] = useState<contentType[]>([]);
  const [user, setUser] = useState<userType[]>([]);

  const getContents = () => {
    setContent([]);
    setUser([]);
    const url = `http://localhost:3000`;
    const config = { withCredentials: true };
    axios.get(url, config).then(response => {
      console.log(response);
      response.data.users.forEach((e: userType) => setUser(user => [...user, e]));
      response.data.tweets.forEach((e: contentType) => setContent(content => [...content, e]));
    }).catch(error => {
      console.log("There are something errors", error);
    });
  };

  /*
    const TimeLine = () => {
      const timeLineContent = content.map((e, i) => {
        const whoTweet = user.filter(user => {
          return user.id === e.user_id;
        });
        const tweetUser = whoTweet[0];
  
        return (
          <div key={i}>
            {tweetUser.profile_image?.url && <img src={`http://localhost:3000/${tweetUser.profile_image.url}`} alt="user" />}
            <p>{tweetUser.name}</p>
            <p>{e.content}</p>
            {e.tweet_image?.url && <img src={`http://localhost:3000/${e.tweet_image.url}`} alt="tweet" />}
            <p>{e.created_at}</p>
          </div>
        );
      });
  
      return (
        <div>
          {timeLineContent}
        </div>
      );
    };
  */
  const timeline = useTimeline(user, content);

  return (
    <>
      <button onClick={getContents}>更新</button>
      {timeline}
    </>
  );
}

export default HomeContent;
