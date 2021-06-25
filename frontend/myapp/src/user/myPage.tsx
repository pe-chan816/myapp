import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";


const MyPage = () => {
  const myPageId = Object.values(useParams());
  const [userId, setUserId] = useState<number>();
  const [userName, setUserName] = useState<string>("");
  const targetUser = () => {
    axios.get(`http://localhost:3000/users/${myPageId}`, { withCredentials: true }).then(response => {
      setUserId(response.data.user.id);
      setUserName(response.data.user.name);
    })
  }

  useEffect(targetUser, [myPageId]);
  console.log("loading.....");

  return (
    <div>
      <p>ユーザーID: {userId}</p>
      <p>名前: {userName}</p>
      <p>マイページ</p>
    </div>
  );
}



export default MyPage;
