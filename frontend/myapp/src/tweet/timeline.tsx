import axios from 'axios';
import { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, Link, makeStyles, Tooltip } from '@material-ui/core';

import { HashtagType, TimelineType } from 'types/typeList';

import PersonIcon from '@material-ui/icons/Person';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';


const Timeline = (props: { data: Partial<TimelineType[]> }) => {
  const data = props.data;
  // いいねの再描画のためのstate //
  const [rendering, setRendering] = useState<boolean>(false);
  /////////////////////////////
  const history = useHistory();
  const useStyles = makeStyles({
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

  const content = data.map((e, i) => {
    if (e) {

      const hashtags = e.hashname?.map((tag: HashtagType, num: number) => {
        return (
          <div key={num}>
            <Button color="primary" onClick={() => clickTagButton(tag.hashname)} >
              #{tag.hashname}
            </Button>
          </div>
        );
      });

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
              } />
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
                alignItems="center">

                <Grid item>
                  <Grid container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center">
                    <Grid item>
                      {e.fav_or_not === false &&
                        <Tooltip title="いいね">
                          <Button onClick={() => clickFavoriteButton(e)} size="small">
                            <ThumbUpIcon color="inherit" fontSize="small" />
                          </Button>
                        </Tooltip>}
                      {e.fav_or_not === true &&
                        <Tooltip title="いいね解除">
                          <Button onClick={() => clickUnFavriteButton(e)} size="small">
                            <ThumbUpOutlinedIcon color="inherit" fontSize="small" />
                          </Button>
                        </Tooltip>}

                    </Grid>
                    <Grid item>
                      <p>{e.favorite_count}</p>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <p>{e.created_at}</p>
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
