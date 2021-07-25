import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useParams } from "react-router";

import { UserType, TimelineType } from 'types/typeList';

import { CurrentUserContext, UserContext } from 'App';
import { FollowOrNotContext } from 'App';

import Timeline from "tweet/timeline";

const MyPage = (props: any) => {
  console.log("!!MyPage!!");
  const myPageId = Object.values(useParams());

  const { currentUser } = useContext(CurrentUserContext);

  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState<TimelineType[]>([]);
  const { followOrNot, setFollowOrNot } = useContext(FollowOrNotContext);
  const [followings, setFollowings] = useState<UserType[]>([]);
  const [followingsNumber, setFollowingsNumber] = useState<number>(0);
  const [followers, setFollowers] = useState<UserType[]>([]);
  const [followersNumber, setFollowersNumber] = useState<number>(0);

  const resetData = () => {
    setFollowings([]);
    setFollowers([]);
    setData([]);
  }

  const getData = () => {
    console.log("!!getData!!");
    resetData();
    const url = `http://localhost:3000/users/${myPageId}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      console.log(res.data);

      setUser(res.data.user);
      res.data.mypage_data.forEach((e: TimelineType) => setData(data => [...data, e]));
      setFollowOrNot(res.data.follow_or_not);
      res.data.followings.forEach((e: UserType) => setFollowings(followings => [...followings, e]));
      setFollowingsNumber(res.data.followings_count);
      res.data.followers.forEach((e: UserType) => setFollowers(followers => [...followers, e]));
      setFollowersNumber(res.data.followers_count);
    }).catch(error => {
      console.log(error);
    });
  };
  useEffect(getData, [props.location.pathname]);

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
        const sendData = { followed_id: user.id };
        const config = { withCredentials: true };
        axios.post(url, sendData, config).then(res => {
          console.log(res.data);
          setFollowOrNot(true);
          setFollowersNumber(res.data.number_of_followers);
        }).catch(error => {
          console.log(error);
        });
      };
      const clickUnfollow = () => {
        const url = `http://localhost:3000/unfollow`;
        const sendData = { followed_id: user.id };
        const config = { withCredentials: true };
        axios.post(url, sendData, config).then(res => {
          console.log(res.data);
          setFollowOrNot(false);
          setFollowersNumber(res.data.number_of_followers);
        }).catch(error => {
          console.log(error);
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

        <Timeline data={data} />
      </div >
    );
  };

  return (
    <>
      <MypageContent />
    </>
  );

};

export default MyPage;
