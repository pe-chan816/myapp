import { useEffect, useState } from "react";
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

  type userType = {
    email: string;
    id: number;
    name: string;
    profile_image: {
      url?: string
    };
  }

  const [user, setUser] = useState<Partial<userType>>({});
  const [followings, setFollowings] = useState<userType[]>([]);
  const [followers, setFollowers] = useState<userType[]>([]);
  const [tweet, setTweet] = useState<tweetType[]>([]);

  const resetData = () => {
    setUser({});
    setFollowings([]);
    setFollowers([]);
    setTweet([]);
  }

  const getData = () => {
    resetData();

    const url = `http://localhost:3000/users/${myPageId}`;
    axios.get(url, { withCredentials: true }).then(response => {
      console.log(response.data);

      setUser(response.data.user);
      response.data.followings.forEach((e: userType) => setFollowings(followings => [...followings, e]));
      response.data.followers.forEach((e: userType) => setFollowers(followers => [...followers, e]));
      response.data.tweets.forEach((e: tweetType) => setTweet(tweet => [...tweet, e]));
      console.log("fetched rails");
    })
  }

  useEffect(getData, [props.location.pathname]);

  const MyPageTimeline = () => {

    const tweets = tweet.map((e, i) => {
      const imageUrl = e.tweet_image.url;
      const url = `http://localhost:3000/${imageUrl}`;
      return (
        <div key={i}>
          <p>
            {e.user_id} : {e.content}
          </p>
          {imageUrl && <img src={url} alt="tweet" />}
        </div>
      );
    });

    return <div>{tweets}</div>;
  }

  const MypageContent = () => {
    const userImage = user.profile_image?.url;
    const url = `http://localhost:3000/${user.profile_image?.url}`;
    return (
      <div>
        {userImage && <img src={url} alt="user" />}
        <p>名前: {user.name}</p>
        <p>フォロー : {followings.length}</p>
        <p>フォロワー : {followers.length}</p>
        <MyPageTimeline />
      </div>
    );
  }

  console.log("loading.....");
  return (
    <MypageContent />
  );
}

export default MyPage;
