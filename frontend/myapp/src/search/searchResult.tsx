import axios from "axios";
import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Link } from '@material-ui/core';

import { HashtagType, TimelineType, UserType } from "types/typeList";

import Timeline from "tweet/timeline";


const SearchResult = (prop: any) => {
  console.log("!!SearchResult!!");
  const keyword = Object.values(useParams());
  const [tagData, setTagData] = useState<Partial<HashtagType[]>>([]);
  const [tweetData, setTweetData] = useState<Partial<TimelineType[]>>([]);
  const [userData, setUserData] = useState<Partial<UserType[]>>([]);

  console.log(keyword);
  const getSearchResult = () => {
    setTweetData([]);
    setTagData([]);
    setUserData([]);
    const url = `${process.env.REACT_APP_API_DOMAIN}/search/${keyword}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      console.log(res);
      setTweetData(res.data.searched_tweet);
      setTagData(res.data.searched_tag);
      setUserData(res.data.searched_user);
    });
  };
  useEffect(getSearchResult, [prop.match.params]);

  const searchedTag = tagData.map((e, i) => {
    const tagUrl = `/hashtag/${e?.hashname}`;
    if (e) {
      return (
        <div key={i}>
          <Link component={RouterLink} to={tagUrl}>{e.hashname}</Link>
        </div>
      );
    }
  });

  const searchedUser = userData.map((e, i) => {
    if (e) {
      const imageUrl = `${process.env.REACT_APP_API_DOMAIN}/${e.profile_image?.url}`;
      const userUrl = `/user/${e.id}`;

      return (
        <div key={i}>
          {e.profile_image?.url && <img src={imageUrl} alt="user" />}
          <Link color="inherit" component={RouterLink} to={userUrl}>{e.name}</Link>
          <p>@{e.unique_name}</p>
        </div>
      );
    }
  });

  return (
    <div>
      <h3>" {keyword} " の検索結果</h3>
      {tweetData.toString() !== [].toString() &&
        <>
          <h4>↓ツイート↓</h4>
          <Timeline data={tweetData} />
        </>}
      {tagData.toString() !== [].toString() &&
        <>
          <h4>↓ハッシュタグ↓</h4>
          <div>{searchedTag}</div>
        </>}
      {userData.toString() !== [].toString() &&
        <>
          <h4>↓ユーザー↓</h4>
          <div>{searchedUser}</div>
        </>}
    </div>
  );
};

export default SearchResult;
