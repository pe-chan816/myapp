import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router";

const MyPage = (props: any) => {
  const myPageId = Object.values(useParams());

  type tweetType = {
    id: number;
    content: string;
    user_id: number;
    tweet_image: {
      url?: string
    };
  }

  type userType = {
    email: string;
    id: number;
    name: string;
    profile_image: {
      url?: string
    };
  }

  const [user, setUser] = useState<Partial<userType>>({});
  const [tweet, setTweet] = useState<tweetType[]>([]);

  const targetUser = () => {
    setUser({});
    setTweet([]);
    const url = `http://localhost:3000/users/${myPageId}`;
    axios.get(url, { withCredentials: true }).then(response => {
      console.log(response.data);

      setUser(response.data.user);
      response.data.tweets.forEach((e: tweetType) => setTweet(tweet => [...tweet, e]));
      console.log("fetched rails");
    })
  }

  useEffect(targetUser, [props.location.pathname]);

  const MyPageTweet = () => {

    const tweets = tweet.map((e, i) => {
      const imageUrl = e.tweet_image.url;
      return (
        <>
          <p key={i}> {e.user_id} : {e.content}</p>
          {imageUrl && <img src={`http://localhost:3000/${imageUrl}`} alt="画像" />}
        </>
      );
    });

    return <div>{tweets}</div>;
  }

  console.log("loading.....");
  const MypageTimeline = () => {
    const userImage = user.profile_image?.url;
    return (
      <div>
        <p>ユーザーID: {user.id}</p>
        <p>名前: {user.name}</p>
        {userImage && <img src={`http://localhost:3000/${user.profile_image?.url}`} alt="画像" />}
        <p>マイページ</p>
        <MyPageTweet />
      </div>
    );
  }

  return (
    <div>
      <MypageTimeline />
    </div>
  );
}

export default MyPage;
