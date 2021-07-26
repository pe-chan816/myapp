import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

import { Pagination } from '@material-ui/lab';

import { TimelineType } from "types/typeList";

import Timeline from "tweet/timeline";

const MyFavorite = (props: any) => {
  console.log(props);
  const userId = Object.values(useParams());
  const [data, setData] = useState<Partial<TimelineType[]>>([]);
  const [page, setPage] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const getFavoriteData = () => {
    setData([]);
    const url = `http://localhost:3000/users/${userId}/myfavorite`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      console.log(res);
      res.data.my_favorites.forEach((e: TimelineType) => setData(data => [...data, e]));
      const number = Math.ceil(res.data.my_favorites_count / 15);
      setPageNumber(number);
    });
  };
  useEffect(getFavoriteData, []);

  const handlePagination = (p: number) => {
    setPage(p);
    setData([]);
    const url = `http://localhost:3000//users/${userId}/myfavorite?page=${p}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(response => {
      response.data.my_favorites.forEach((e: TimelineType) => setData(data => [...data, e]));
    }).catch(error => {
      console.log("There are something errors", error);
    });
  };

  const MyPagination = () => {
    return (
      <Pagination color="primary"
        count={pageNumber}
        onChange={(e, p) => handlePagination(p)}
        page={page}
        variant="outlined"
        shape="rounded" />
    );
  }

  console.log(data);
  return (
    <div>
      <h3>いいねしたツイート</h3>
      <Timeline data={data} />
      <MyPagination />
    </div>
  );
};

export default MyFavorite
