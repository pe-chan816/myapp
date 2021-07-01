import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useParams } from "react-router";

import { UserType, TweetType } from 'types/typeList';

import { CurrentUserContext, UserContext } from 'App';
import { FollowOrNotContext } from 'App';

import useTimeline from 'hooks/useTimeline';

const MyPage = (props: any) => {
  const myPageId = Object.values(useParams());

  const { currentUser } = useContext(CurrentUserContext);

  const { user, setUser } = useContext(UserContext);
  const { followOrNot, setFollowOrNot } = useContext(FollowOrNotContext);
  const [followings, setFollowings] = useState<UserType[]>([]);
  const [followingsNumber, setFollowingsNumber] = useState<number>(0);
  const [followers, setFollowers] = useState<UserType[]>([]);
  const [followersNumber, setFollowersNumber] = useState<number>(0);
  const [tweet, setTweet] = useState<TweetType[]>([]);

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
      response.data.followings.forEach((e: UserType) => setFollowings(followings => [...followings, e]));
      setFollowingsNumber(response.data.followings_count);
      response.data.followers.forEach((e: UserType) => setFollowers(followers => [...followers, e]));
      setFollowersNumber(response.data.followers_count);
      response.data.tweets.forEach((e: TweetType) => setTweet(tweet => [...tweet, e]));
      console.log("fetched rails");
    })
  }
  useEffect(getData, [props.location.pathname]);

  const targetUser: Partial<UserType>[] = Array(user);
  const timeline = useTimeline(targetUser, tweet);

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
          setFollowersNumber(response.data.number_of_followers);
        });
      };
      const clickUnfollow = () => {
        const url = `http://localhost:3000/unfollow`;
        const data = { followed_id: user.id };
        const config = { withCredentials: true };
        axios.post(url, data, config).then(response => {
          console.log(response.data);
          setFollowOrNot(false);
          setFollowersNumber(response.data.number_of_followers);
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
        <p>フォロー: <Link to={followingsPage}>{followingsNumber}</Link></p>
        <p>フォロワー : <Link to={followersPage}>{followersNumber}</Link></p>

        {user.id !== currentUser.id && <FollowButton />}
        {timeline}
      </div >
    );
  };

  console.log("loading.....");
  return (
    <>
      <MypageContent />
    </>
  );

}

export default MyPage;
