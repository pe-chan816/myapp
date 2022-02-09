import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link as RouterLink } from 'react-router-dom';
import { useParams } from "react-router";

import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Grid, Link, makeStyles } from "@material-ui/core";
import { Pagination } from '@material-ui/lab';
import PersonIcon from '@material-ui/icons/Person';

import { UserType, TimelineType } from 'types/typeList';

import { CurrentUserContext, UserContext } from 'App';
import { FollowOrNotContext } from 'App';
import DeleteUserAccount from "./deleteUserAccount";

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
  const [page, setPage] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const useStyles = makeStyles({
    card: {
      margin: "10px auto",
      maxWidth: "600px"
    },
    pagination: {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      margin: "0 auto",
      maxWidth: "600px"
    },
    followFollower: {
      margin: "0 5px"
    }
  });
  const classes = useStyles();

  const resetData = () => {
    setFollowings([]);
    setFollowers([]);
    setData([]);
  };

  const getData = () => {
    console.log("!!getData!!");
    resetData();
    const url = `${process.env.REACT_APP_API_DOMAIN}/users/${myPageId}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      console.log(res.data);

      setUser(res.data.user);
      setData(res.data.mypage_data);

      setFollowOrNot(res.data.follow_or_not);
      setFollowings(res.data.followings);
      setFollowingsNumber(res.data.followings_count);
      setFollowers(res.data.followers);
      setFollowersNumber(res.data.followers_count);

      const number = Math.ceil(res.data.mypage_data_count / 15);
      setPageNumber(number);
    }).catch(error => {
      console.log(error);
    });
  };
  useEffect(getData, []);

  const MypageContent = () => {
    const url = `${process.env.REACT_APP_IMAGE_URL}${user.profile_image?.url}`;
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
        const url = `${process.env.REACT_APP_API_DOMAIN}/relationships`;
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
        const url = `${process.env.REACT_APP_API_DOMAIN}/unfollow`;
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
        return (
          <Button color="primary"
            onClick={clickFollow}
            size="small"
            variant="outlined">
            フォロー
          </Button>
        );
      } else {
        return (
          <Button color="primary"
            onClick={clickUnfollow}
            size="small"
            variant="outlined">
            フォロー解除
          </Button>
        );
      }
    };

    return (
      <div>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar alt="user-image" src={url}>
                <PersonIcon color="inherit" fontSize="large" />
              </Avatar>
            }
            title={
              <div>
                <Link color="inherit" component={RouterLink}
                  to={myPageUrl} underline="none"
                >
                  {user.name}
                </Link>
                <p>@{user.unique_name}</p>
              </div>
            }
          />
          <CardContent>
            <p>{user.self_introduction}</p>
          </CardContent>
          <CardActions disableSpacing>
            <Grid alignItems="flex-start"
              container
              direction="column"
              justifyContent="center"
            >
              <Grid item>
                <Grid container>
                  <Grid className={classes.followFollower} item>
                    <Link color="inherit" component={RouterLink} to={followingsPage}>
                      <span style={{ fontWeight: "bold" }}>{followingsNumber}</span>
                      フォロー中
                    </Link>
                  </Grid>
                  <Grid className={classes.followFollower} item>
                    <Link color="inherit" component={RouterLink} to={followersPage}>
                      <span style={{ fontWeight: "bold" }}>{followersNumber}</span>
                      フォロワー
                    </Link>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                {user.id !== currentUser.id &&
                  <FollowButton />}
              </Grid>

              <Grid item>
                {currentUser.admin === true &&
                  <DeleteUserAccount />}
              </Grid>

            </Grid>
          </CardActions>
        </Card>
      </div >
    );
  };

  const handlePagination = (p: number) => {
    setPage(p);
    setData([]);
    const url = `${process.env.REACT_APP_API_DOMAIN}/users/${myPageId}?page=${p}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      setData(res.data.mypage_data);
    }).catch(error => {
      console.log("There are something errors", error);
    });
  };

  const MyPagination = () => {
    return (
      <Pagination className={classes.pagination}
        color="primary"
        count={pageNumber}
        onChange={(e, p) => handlePagination(p)}
        page={page}
        variant="outlined"
        shape="rounded" />
    );
  }

  return (
    <>
      <MypageContent />
      {data.toString() !== [].toString() &&
        <>
          <Timeline data={data} />
          <MyPagination />
        </>}
    </>
  );

};

export default MyPage;
