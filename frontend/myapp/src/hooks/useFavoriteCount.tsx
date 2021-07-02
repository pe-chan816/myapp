import { useState } from "react";
import axios from "axios";

export const useFavoriteCount = (e: number) => {
  const [count, setCount] = useState<number>(0);
  const url = `http://localhost:3000//tweets/${e}/favorite`;
  const config = { withCredentials: true };
  axios.get(url, config).then(res => {
    console.log(res);
    setCount(res.data.favorite_count);
  });
  return (
    <>
      <p>{count}</p>
    </>
  );
};
