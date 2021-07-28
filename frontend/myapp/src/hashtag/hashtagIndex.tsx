import axios from "axios";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Grid, Link, makeStyles } from '@material-ui/core';

import { HashtagType } from "types/typeList";

const HashtagIndex = () => {
  console.log("!!hashtagIndex!!");

  const [data, setData] = useState<HashtagType[]>([]);
  const useStyles = makeStyles({
    base: {
      margin: "0 auto",
      maxWidth: "800%",
      width: "60%"
    }
  });
  const classes = useStyles();

  const getIndexData = () => {
    setData([]);
    const url = `http://localhost:3000/hashtags`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      setData(res.data.hashtags);
    }).catch(error => {
      console.log("error ->", error);
    });
  };
  useEffect(getIndexData, []);

  const hashtagIndexContent = data.map((e, i) => {
    return (
      <Grid key={i} item>
        <Link component={RouterLink} to={`/hashtag/${e.hashname}`}>
          {e.hashname}({e.count})
        </Link>
      </Grid>
    );
  });

  return (
    <div >
      <Grid alignItems="center"
        className={classes.base}
        container
        direction="column"
        justifyContent="flex-start"
      >
        <h3>ハッシュタグ一覧</h3>
        <Grid alignItems="center"
          container
          direction="row"
          justifyContent="center"
          spacing={1}
        >
          {hashtagIndexContent}
        </Grid>
      </Grid>
    </div>
  );
};

export default HashtagIndex;
