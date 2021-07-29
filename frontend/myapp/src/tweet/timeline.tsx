import axios from 'axios';
import { useContext, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, Link, makeStyles, Tooltip } from '@material-ui/core';

import { HashtagType, TimelineType } from 'types/typeList';

import DeleteIcon from '@material-ui/icons/Delete';
import PersonIcon from '@material-ui/icons/Person';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';

import { CurrentUserContext } from 'App';


const Timeline = (props: { data: Partial<TimelineType[]> }) => {
  const [data, setData] = useState<Partial<TimelineType[]>>(props.data);
  const { currentUser } = useContext(CurrentUserContext);
  // いいねの再描画のためのstate //
  const [rendering, setRendering] = useState<boolean>(false);
  /////////////////////////////
  const history = useHistory();
  const useStyles = makeStyles({
    deleteButton: {
      margin: "0 8px"
    },
    card: {
      margin: "10px auto 10px auto",
      maxWidth: "800px",
      zIndex: 1
    },
    cardHeader: {
      paddingTop: "10px",
      paddingBottom: "10px"
    },
    cardContent: {
      paddingTop: "0px",
      paddingBottom: "0px"
    },
    cardActions: {
      fontSize: 13
    },
    favoriteCount: {
      marginLeft: "8px"
    },
    hashtag: {
      textTransform: "none"
    }
  });
  const classes = useStyles();

  const clickTagButton = (tagName: string) => {
    history.push(`/hashtag/${tagName}`)
  };

  const clickFavoriteButton = (tweet: TimelineType) => {
    const url = `http://localhost:3000/favorites`;
    const newData = { favorite_tweet_id: tweet.id };
    const config = { withCredentials: true };
    axios.post(url, newData, config).then(res => {
      console.log(res);
      tweet.fav_or_not = !(tweet.fav_or_not);
      tweet.favorite_count += 1;
      setRendering(!rendering);
    });
  };

  const clickUnFavriteButton = (tweet: TimelineType) => {
    const url = `http://localhost:3000/unfavorite`;
    const newData = { tweet_id: tweet.id };
    const config = { withCredentials: true };
    axios.post(url, newData, config).then(res => {
      console.log(res);
      tweet.fav_or_not = !(tweet.fav_or_not);
      tweet.favorite_count -= 1;
      setRendering(!rendering);
    });
  };

  const clickDeleteButton = (tweetId: number, indexNumber: number) => {
    const url = `http://localhost:3000/tweets/${tweetId}`;
    const config = { withCredentials: true };
    axios.delete(url, config).then(res => {
      console.log(res);
      const newData = [...data];
      newData.splice(indexNumber, 1);
      setData(newData);
    });
  };

  const content = data.map((e, i) => {
    if (e) {
      const hashtags = e.hashname?.map((tag: HashtagType, num: number) => {
        return (
          <div key={num}>
            <Button className={classes.hashtag}
              color="primary"
              onClick={() => clickTagButton(tag.hashname)}
            >
              #{tag.hashname}
            </Button>
          </div>
        );
      });

      const FavoriteButton = () => {
        if (e.user_id === currentUser.id) {
          return (
            <ThumbUpIcon color="inherit" fontSize="small" />
          );
        } else {
          if (e.fav_or_not === false) {
            return (
              <Tooltip title="いいね">
                <Link color="inherit"
                  component="button"
                  onClick={() => clickFavoriteButton(e)}
                >
                  <ThumbUpIcon color="inherit" fontSize="small" />
                </Link>
              </Tooltip>
            );
          } else {
            return (
              <Tooltip title="いいね解除">
                <Link color="inherit"
                  component="button"
                  onClick={() => clickUnFavriteButton(e)}
                >
                  <ThumbUpOutlinedIcon color="inherit" fontSize="small" />
                </Link>
              </Tooltip>
            );
          }
        }
      };

      const DeleteButton = () => {
        if (e.user_id === currentUser.id) {
          return (
            <Tooltip title="ポスト削除">
              <Link className={classes.deleteButton}
                color="inherit"
                component="button"
                onClick={() => clickDeleteButton(e.id, i)}
              >
                <DeleteIcon />
              </Link>
            </Tooltip>
          );
        } else {
          return null;
        }
      };

      return (
        <div className={classes.card} key={i}>
          <Card>
            <CardHeader
              avatar={
                <Avatar alt="user-image"
                  src={`http://localhost:3000/${e.profile_image?.url}`}
                >
                  <PersonIcon color="inherit" fontSize="large" />
                </Avatar>
              }
              className={classes.cardHeader}
              title={
                <Link color="inherit" component={RouterLink} to={`/user/${e.user_id}`}>
                  {e.name}
                </Link>
              }
            />
            {e.tweet_image?.url &&
              <CardMedia component="img"
                src={`http://localhost:3000/${e.tweet_image.url}`}
                title="post-image" />}

            <CardContent className={classes.cardContent}>
              <p>{e.content}</p>
              {e.hashname &&
                <div>{hashtags}</div>}
            </CardContent>

            <CardActions className={classes.cardActions} disableSpacing>
              <Grid container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Grid container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Grid item>
                      <FavoriteButton />
                    </Grid>

                    <Grid className={classes.favoriteCount} item>
                      <p>{e.favorite_count}</p>
                    </Grid>

                  </Grid>
                </Grid>

                <Grid item>
                  <Grid alignItems="center"
                    container
                    direction="row"
                    justifyContent="flex-end"
                  >
                    <p>{e.created_at}</p>
                    <DeleteButton />
                  </Grid>
                </Grid>

              </Grid>
            </CardActions>

            <Link component={RouterLink} to={`/tweets/${e.id}/detail`}>
              <button>詳細</button>
            </Link>

          </Card>
        </div>
      );
    }
  });

  return (
    <div>
      {content}
    </div>
  );
};

export default Timeline;
