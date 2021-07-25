import { HashtagType, TimelineType } from 'types/typeList';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, Link, makeStyles, Tooltip } from '@material-ui/core';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';


const Timeline = (props: { data: Partial<TimelineType[]> }) => {
  const data = props.data;
  const history = useHistory();
  const useStyles = makeStyles({
    card: {
      margin: "10px auto 10px auto",
      maxWidth: "800px",
      zIndex: 1
    },
    cardHeader: {
      paddingTop: "10px",
      paddingBottom: "0px"
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
                  {e.name}
                </Avatar>
              }
              className={classes.cardHeader}
              title={
                <Link color="inherit" component={RouterLink}
                  to={`/user/${e.user_id}`} underline="none"
                >
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
                      <Tooltip title="いいね">
                        <Button size="small">
                          <ThumbUpIcon color="inherit" fontSize="small" />
                        </Button>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <p>いいね数</p>
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
