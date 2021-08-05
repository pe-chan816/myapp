import axios from "axios";
import { useEffect, useState } from "react";

import { Button, Grid, makeStyles } from "@material-ui/core";
import { TimelineType } from "types/typeList";

import Timeline from "tweet/timeline";

const HotTweet = () => {
  const [data, setData] = useState<TimelineType[]>([]);
  const [page, setPage] = useState<number>(1);
  const useStyles = makeStyles({
    base: {
      margin: "0 auto",
      maxWidth: "600px",
      width: "100%"
    },
    button: {
      alignItems: "center",
      display: "flex",
      margin: "5px auto",
      maxWidth: "600px",
      width: "100%"
    }
  });
  const classes = useStyles();

  const getHotTweetData = () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/tweets`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      setData(res.data.hot_tweet_data);
    }).catch(error => { console.log(error) });
  };
  useEffect(() => { getHotTweetData() }, []);

  const clickBack = () => {
    const previousPage = page - 1;
    setData([]);
    const url = `${process.env.REACT_APP_API_DOMAIN}/tweets?page=${previousPage}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      setData(res.data.hot_tweet_data);
      setPage(previousPage);
    }).catch(error => {
      console.log("There are something errors", error);
    });
  };

  const clickNext = () => {
    const nextPage = page + 1;
    setData([]);
    const url = `${process.env.REACT_APP_API_DOMAIN}/tweets?page=${nextPage}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      setData(res.data.hot_tweet_data);
      setPage(nextPage);
    }).catch(error => {
      console.log("There are something errors", error);
    });
  };

  return (
    <Grid container
      className={classes.base}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item>
        <h3 className={classes.base}>最新ポスト</h3>
      </Grid>
      <Grid className={classes.base} item>
        <Button className={classes.button}
          color="primary"
          onClick={getHotTweetData}
          variant="outlined"
        >
          更新
        </Button>
      </Grid>
      <Grid className={classes.base} item>
        {data.toString() !== [].toString() &&
          <Timeline data={data} />}
      </Grid>
      <Grid item>
        {page > 1 &&
          <Button onClick={clickBack} variant="outlined">前へ</Button>}
        {data.length === 15 &&
          <Button onClick={clickNext} variant="outlined">次へ</Button>}
      </Grid>
    </Grid>
  );
};

export default HotTweet;
