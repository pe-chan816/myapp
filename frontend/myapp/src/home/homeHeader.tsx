import { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';

import { LoginStateContext } from 'App';
import { ModalStateContext } from 'App';
import { CurrentUserContext } from 'App';

import HomeContent from './homeContent';
import MyPage from 'user/myPage';
import UpdateUserSettings from 'user/updateUserSettings';
import TweetForm from 'tweet/tweetForm';
import UserRelationship from 'user/followings';
import TweetDetail from 'tweet/tweetDetail';
import MyFavorite from 'favorite/myFavorite';
import HashtagIndex from 'hashtag/hashtagIndex';
import HashtagDetail from 'hashtag/hashtagDetail';
import EditMap from 'hashtag/editMap';
import EditRecipe from 'hashtag/editRecipe';


const HomeHeader = () => {
  console.log("!!HomeHeader!!");
  const { setModalState } = useContext(ModalStateContext);
  const { setLoginState } = useContext(LoginStateContext);
  const { currentUser } = useContext(CurrentUserContext);

  const handleLogoutClick = () => {
    axios.delete("http://localhost:3000/logout", { withCredentials: true }).then(response => {
      console.log("ログアウト状況: ", response);
      setLoginState(false);
    }).catch(error => console.log("ログアウトエラー", error));
  }

  return (
    <div className="header-banner">
      <p>ログイン中</p>

      <Link to="/"><h1>Insyutagram</h1></Link>
      <nav>
        <Link to={`/user/${currentUser.id}`}>マイページ</Link>
        <Link to="/tweet">ツイート</Link>
        <Link to="">ユーザー一覧</Link>
        <Link to={`/user/${currentUser.id}/favorite`}>マイいいね</Link>
        <Link to={`/hashtag/index`}>タグ一覧</Link>
        <Link to="/user/edit/account">アカウント設定</Link>
      </nav>

      <Switch>
        <Route path="/" exact component={HomeContent} />
        <Route path="/user/:myPageId" exact component={MyPage} />
        <Route path="/tweet" exact component={TweetForm} />
        <Route path="/user/:userId/favorite" exact component={MyFavorite} />
        <Route path="/hashtag/index" exact component={HashtagIndex} />
        <Route path="/user/edit/account" exact component={UpdateUserSettings} />

        <Route path="/user/:myPageId/followings" exact component={UserRelationship} />
        <Route path="/user/:myPageId/followers" exact component={UserRelationship} />

        <Route path="/tweets/:tweetId/detail" exact component={TweetDetail} />

        <Route path="/hashtag/:hashname" exact component={HashtagDetail} />
        <Route path="/hashtag/:hashname/edit/map" exact component={EditMap} />
        <Route><h1>404 NOT FOUND</h1></Route>
      </Switch>

      <button onClick={() => setModalState(true)}>モーダル</button>
      <button onClick={() => handleLogoutClick()}>ログアウト</button>
    </div>
  );
}

export default HomeHeader;
