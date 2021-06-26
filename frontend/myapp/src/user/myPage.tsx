import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router";

const MyPage = (props: any) => {
  const myPageId = Object.values(useParams());

  type tweetType = {
    id: number;
    content: string;
    user_id: number;
    tweet_image: {
      url?: string
    };
  }

  const [userId, setUserId] = useState<number>();
  const [userName, setUserName] = useState<string>("");
  const [tweet, setTweet] = useState<tweetType[]>([]);

  const targetUser = () => {
    setTweet([]);
    axios.get(`http://localhost:3000/users/${myPageId}`, { withCredentials: true }).then(response => {
      setUserId(response.data.user.id);
      setUserName(response.data.user.name);
      response.data.tweets.forEach((e: tweetType) => setTweet(tweet => [...tweet, e]));
      console.log("fetching rails");
    })
  }

  useEffect(targetUser, [props.location.pathname]);

  console.log(tweet);
  const MyPageTweet = () => {
    const tweets = tweet.map((e, i) => <p key={i}> {e.user_id} : {e.content}</p>);
    return <div>{tweets}</div>;
  }

  console.log("loading.....");
  return (
    <div>
      <p>ユーザーID: {userId}</p>
      <p>名前: {userName}</p>
      <p>マイページ</p>
      <MyPageTweet />
    </div>
  );
}



export default MyPage;
