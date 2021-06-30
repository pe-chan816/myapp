import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useParams } from "react-router";

import { UserContext } from 'App';
import { FollowOrNotContext } from 'App';

type userType = {
  email: string;
  id: number;
  name: string;
  profile_image?: {
    url: string
  };
}

const MyPage = (props: any) => {
  const myPageId = Object.values(useParams());

  type tweetType = {
    id: number;
    content: string;
    user_id: number;
    tweet_image?: {
      url: string
    };
  }

  const { user, setUser } = useContext(UserContext);
  const { followOrNot, setFollowOrNot } = useContext(FollowOrNotContext);
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
      setFollowOrNot(response.data.follow_or_not);
      response.data.followings.forEach((e: userType) => setFollowings(followings => [...followings, e]));
      response.data.followers.forEach((e: userType) => setFollowers(followers => [...followers, e]));
      response.data.tweets.forEach((e: tweetType) => setTweet(tweet => [...tweet, e]));
      console.log("fetched rails");
    })
  }
  useEffect(getData, [props.location.pathname]);

  const MyPageTimeline = () => {

    const tweets = tweet.map((e, i) => {
      const imageUrl = e.tweet_image?.url;
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

    const myPageUrl = `/user/${user.id}`;
    const followingsPage = {
      pathname: `/user/${myPageId}/followings`,
      state: followings
    };
    const followersPage = {
      pathname: `/user/${myPageId}/followers`,
      state: followers
    }

    const FollowButton = () => {
      const clickFollow = () => {
        const url = `http://localhost:3000/relationships`;
        const data = { followed_id: user.id };
        const config = { withCredentials: true };

        axios.post(url, data, config).then(response => {
          console.log(response.data);
          setFollowOrNot(true);
        });
      };
      const clickUnfollow = () => {
        const url = `http://localhost:3000/unfollow`;
        const data = { followed_id: user.id };
        const config = { withCredentials: true };
        axios.post(url, data, config).then(response => {
          console.log(response.data);
          setFollowOrNot(false);
        });
      };

      console.log(followOrNot);

      if (followOrNot === false) {
        return <button onClick={clickFollow}>フォロー</button>;
      } else {
        return <button onClick={clickUnfollow}>フォロー解除</button>;
      }
    };

    return (
      <div>
        {userImage && <img src={url} alt="user" />}
        <p>名前: <Link to={myPageUrl}>{user.name}</Link></p>
        <p>フォロー: <Link to={followingsPage}>{followings.length}</Link></p>
        <p>フォロワー : <Link to={followersPage}>{followers.length}</Link></p>

        <FollowButton />
        <MyPageTimeline />
      </div >
    );
  }

  console.log("loading.....");
  return (
    <>
      <MypageContent />
    </>
  );
}

export default MyPage;
