import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

import { Grid, makeStyles } from "@material-ui/core";
import { Pagination } from '@material-ui/lab';

import { TimelineType } from "types/typeList";

import Timeline from "tweet/timeline";

const MyFavorite = (props: any) => {
  console.log(props);
  const userId = Object.values(useParams());
  const [data, setData] = useState<Partial<TimelineType[]>>([]);
  const [page, setPage] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const useStyles = makeStyles({
    pagination: {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      margin: "0 auto",
      maxWidth: "600px"
    },
    text: {
      textAlign: "center"
    }
  });
  const classes = useStyles();

  const getFavoriteData = () => {
    const url = `http://localhost:3000/users/${userId}/myfavorite`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      console.log(res);
      setData(res.data.my_favorites);
      const number = Math.ceil(res.data.my_favorites_count / 15);
      setPageNumber(number);
    });
  };
  useEffect(getFavoriteData, []);

  const handlePagination = (p: number) => {
    setPage(p);
    const url = `http://localhost:3000//users/${userId}/myfavorite?page=${p}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      setData(res.data.my_favorites);
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
    <div>
      <h3 className={classes.text}>いいねしたポスト</h3>

      {data.toString() !== [].toString() &&
        <>
          <Timeline data={data} />
          <MyPagination />
        </>}
    </div>
  );
};

export default MyFavorite
