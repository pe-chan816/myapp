import axios from "axios";
import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Avatar, Card, CardHeader, FormControl, FormControlLabel, Grid, Link, makeStyles, Radio, RadioGroup } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

import { HashtagType, TimelineType, UserType } from "types/typeList";

import Timeline from "tweet/timeline";


const SearchResult = (prop: any) => {
  console.log("!!SearchResult!!");
  const keyword = Object.values(useParams());
  const [radioValue, setRadioValue] = useState<string>("");
  const [showUser, setShowUser] = useState<boolean>(false);
  const [showPost, setShowPost] = useState<boolean>(false);
  const [showTag, setShowTag] = useState<boolean>(false);
  const [tagData, setTagData] = useState<Partial<HashtagType[]>>([]);
  const [tweetData, setTweetData] = useState<Partial<TimelineType[]>>([]);
  const [userData, setUserData] = useState<Partial<UserType[]>>([]);
  const useStyles = makeStyles({
    card: {
      margin: "10px auto 10px auto",
      maxWidth: "600px",
      zIndex: 1
    },
    cardHeader: {
      paddingTop: "10px",
      paddingBottom: "10px"
    },
    text: {
      textAlign: "center"
    }
  });
  const classes = useStyles();

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
      return (
        <div key={i}>
          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar alt="user-image"
                  src={`${process.env.REACT_APP_IMAGE_URL}${e.profile_image?.url}`}
                >
                  <PersonIcon color="inherit" fontSize="large" />
                </Avatar>
              }
              className={classes.cardHeader}
              title={
                <div>
                  <Link color="inherit" component={RouterLink} to={`/user/${e.id}`}>
                    {e.name}
                  </Link>
                  <p>@{e.unique_name}</p>
                </div>
              }
            />
          </Card>
        </div>
      );
    }
  });

  const handleRadioButton = (u: boolean, p: boolean, t: boolean) => {
    setShowUser(u);
    setShowPost(p);
    setShowTag(t);
  };

  const NoResultPhrase = () => {
    return <p className={classes.text}>検索結果はありませんでした</p>
  };

  const PostResult = () => {
    if (showPost) {
      if (tweetData.toString() !== [].toString()) {
        return <Timeline data={tweetData} />;
      } else {
        return <NoResultPhrase />
      }
    } else {
      return null;
    }
  };

  const UserResult = () => {
    if (showUser) {
      if (userData.toString() !== [].toString()) {
        return <div>{searchedUser}</div>;
      } else {
        return <NoResultPhrase />
      }
    } else {
      return null;
    }
  };

  const TagResult = () => {
    if (showTag) {
      if (tagData.toString() !== [].toString()) {
        return <div className={classes.text}>{searchedTag}</div>;
      } else {
        return <NoResultPhrase />
      }
    } else {
      return null;
    }
  };

  return (
    <div>
      <Grid container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <h3>" {keyword} " の検索結果</h3>

        <FormControl>
          <RadioGroup row value={radioValue}
            onChange={(e) => { setRadioValue(e.target.value) }}
          >
            <FormControlLabel control={<Radio color="primary" size="small" />}
              label="ポスト"
              onChange={() => { handleRadioButton(false, true, false) }}
              value="post" />
            <FormControlLabel control={<Radio color="primary" size="small" />}
              label="ユーザー"
              onChange={() => { handleRadioButton(true, false, false) }}
              value="user" />
            <FormControlLabel control={<Radio color="primary" size="small" />}
              label="ハッシュタグ"
              onChange={() => { handleRadioButton(false, false, true) }}
              value="tag" />
          </RadioGroup>
        </FormControl>
      </Grid>

      <PostResult />
      <UserResult />
      <TagResult />
    </div>
  );
};

export default SearchResult;
