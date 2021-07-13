import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import { TimelineType } from "types/typeList";

import { CurrentUserContext } from "App";


const TweetDetail = () => {
  const tweetId = Object.values(useParams());

  const { currentUser } = useContext(CurrentUserContext);

  const [data, setData] = useState<Partial<TimelineType>>();
  const [count, setCount] = useState<number>(0);
  const [favoriteOrNot, setFavoriteOrNot] = useState<boolean>(false);

  const getDetail = () => {
    const url = `http://localhost:3000/tweets/${tweetId}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      console.log(res);
      setData(res.data.tweet[0]);
      setCount(res.data.favorite_count);
      setFavoriteOrNot(res.data.favorite_or_not);
    });

    console.log("Used Effect///");
  };

  useEffect(getDetail, []);

  if (data) {
    const clickFavoriteButton = () => {
      const url = `http://localhost:3000/favorites`;
      const newData = { favorite_tweet_id: data.id };
      const config = { withCredentials: true };
      axios.post(url, newData, config).then(res => {
        console.log(res);
        setFavoriteOrNot(!favoriteOrNot);
        setCount(count + 1);
      });
    };

    const clickUnFavoriteButton = () => {
      const url = `http://localhost:3000/unfavorite`;
      const newData = { tweet_id: data.id };
      const config = { withCredentials: true };
      axios.post(url, newData, config).then(res => {
        console.log(res);
        setFavoriteOrNot(!favoriteOrNot);
        setCount(count - 1);
      });
    };

    const clickDeleteButton = () => {
      const url = `http://localhost:3000/tweets/${data.id}`;
      const config = { withCredentials: true };
      axios.delete(url, config).then(res => {
        console.log(res);
        window.location.replace(`http://localhost:8000/user/${currentUser.id}`);
      });
    };

    const profileImageUrl = `http://localhost:3000/${data.profile_image?.url}`;
    const tweetImageUrl = `http://localhost:3000/${data.tweet_image?.url}`;

    return (
      <div>
        {data.profile_image?.url && <img src={profileImageUrl} alt="user" />}
        <Link to={`/user/${data.user_id}`}>
          <p>{data.name}</p>
        </Link>
        <p>{data.content}</p>
        {data.tweet_image?.url && <img src={tweetImageUrl} alt="tweet" />}
        <p>{data.created_at}</p>

        <div>
          <p>{count} いいね</p>
          {!favoriteOrNot && <button onClick={clickFavoriteButton}>いいね</button>}
          {favoriteOrNot && <button onClick={clickUnFavoriteButton}>いいね取消</button>}
        </div>

        {data.user_id === currentUser.id &&
          <div>
            <button onClick={clickDeleteButton}>ツイート削除</button>
          </div>
        }
      </div>
    );
  } else {
    return null;
  };
}

export default TweetDetail;
